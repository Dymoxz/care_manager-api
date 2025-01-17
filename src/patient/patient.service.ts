import { Injectable } from '@nestjs/common';
import { Patient } from './patient.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdatePatientDto } from './patient.dto';
import { Room } from '../room/room.schema';
import { ClinicalProfile } from '../clinicalProfile/clinicalProfile.schema';
import { Medicine } from '../medicine/medicine.schema';
import { MedCheck } from 'src/medcheck/medcheck.schema';

@Injectable()
export class PatientService {
  constructor(
    @InjectModel(Patient.name) private patientModel: Model<Patient>,
    @InjectModel(Room.name) private roomModel: Model<Room>,
    @InjectModel(ClinicalProfile.name)
    private clinicalProfileModel: Model<ClinicalProfile>,
    @InjectModel(Medicine.name) private medicineModel: Model<Medicine>,
    @InjectModel(MedCheck.name) private medCheckModel: Model<MedCheck>,
  ) {}

  async getAll(): Promise<Patient[]> {
    const patients = await this.patientModel
      .find()
      .populate('room') // Populate room details
      .populate('clinicalProfiles') // Populate clinical profile details
      .populate('medChecks') // Populate agreements
      .exec();

    for (const patient of patients) {
      if (patient.medicineAtcCodes && patient.medicineAtcCodes.length > 0) {
        // Query the Medicine model to get full details for the ATC codes
        // Attach the full medicine details to the patient object
        (patient as any)._doc.fullMedicines = await this.medicineModel
          .find({ atcCode: { $in: patient.medicineAtcCodes } })
          .exec(); // Store in `_doc` to keep original structure intact
      }
    }

    console.log('Get all patients', patients);
    return patients;
  }

  async createPatient(data: any): Promise<Patient> {
    const { createPatientDto, roomNumber, clinicalProfiles, medicineAtcCodes } =
      data;

    // Get all clinical profile objects based on the passed clinicalProfiles array
    const profiles = await Promise.all(
      clinicalProfiles.map(async (profileName: string) => {
        const profile = await this.clinicalProfileModel
          .findOne({ clinicalProfile: profileName })
          .exec();

        if (!profile) {
          throw new Error(`ClinicalProfile '${profileName}' not found`);
        }

        return profile._id;
      }),
    );

    // Create the new patient object
    const newPatient = new this.patientModel({
      ...createPatientDto,
      clinicalProfiles: profiles, // Set the array of ClinicalProfile references
      medicineAtcCodes: medicineAtcCodes,
    });

    // Save the patient and assign a room in a single operation
    const savedPatient = await newPatient.save();

    // Assign the room to the patient
    const updatedPatient = await this.assignRoomToPatient(
      savedPatient.patientNumber,
      roomNumber,
    );

    // Return the updated patient data, including populated room and clinicalProfiles
    const result = await this.patientModel
      .findOne({ patientNumber: updatedPatient.patientNumber })
      .populate('room')
      .populate('clinicalProfiles') // Populate the clinicalProfiles array
      .exec();

    console.log('Created patient', result);
    return result;
  }

  async assignRoomToPatient(
    patientNumber: number,
    roomNumber: number,
  ): Promise<Patient> {
    const room = await this.roomModel.findOne({ roomNumber }).exec();

    if (!room) {
      throw new Error(`Room with roomNumber ${roomNumber} not found`);
    }

    const updatedPatient = await this.patientModel
      .findOneAndUpdate({ patientNumber }, { room: room._id }, { new: true })
      .populate('room')
      .exec();

    if (!updatedPatient) {
      throw new Error(`Patient with patientNumber ${patientNumber} not found`);
    }

    return updatedPatient;
  }

  async getPatient(patientNumber: string): Promise<Patient> {
    const patient = await this.patientModel
      .findOne({ patientNumber: patientNumber }) // Use `findOne` for a query based on `patientNumber`
      .populate('room') // Populate room details
      .populate('clinicalProfiles') // Populate clinical profile details
      .populate('agreements') // Populate agreements
      .populate('medChecks') // Populate medChecks
      .exec();

    if (!patient) {
      console.log(`No patient found with BSN: ${patientNumber}`);
      return null;
    }

    // If the patient has medicine ATC codes, query the Medicine model for full details
    if (patient.medicineAtcCodes && patient.medicineAtcCodes.length > 0) {
      (patient as any)._doc.medicines = await this.medicineModel
        .find({ atcCode: { $in: patient.medicineAtcCodes } })
        .exec(); // Attach `medicines` to the patient object
    }

    console.log('Get a patient', patient);
    return patient as any; // Ensure the returned object includes the medicines
  }

  async updatePatient(
    patientNumber: string,
    updatePatientDto: UpdatePatientDto,
  ): Promise<Patient> {
    const result = this.patientModel
      .findByIdAndUpdate({ patientNumber: patientNumber }, updatePatientDto, {
        new: true,
      })
      .exec();
    console.log('Update a patient', result);
    return result;
  }

  async getPatientByCaretaker(caretakerBig: string): Promise<Patient[]> {
    console.log('Get all patients by caretaker', caretakerBig);
    const result = this.patientModel
      .find({ careTaker: caretakerBig })
      .populate('room')
      .exec();
    console.log('Get all patients', result);
    return result;
  }

  async deletePatient(patientNumber: string): Promise<Patient | null> {
    // Update the return type
    try {
      const result = await this.patientModel
        .findOneAndDelete({ patientNumber: patientNumber })
        .exec(); // Await exec and type
      console.log('Delete a patient', result);
      return result;
    } catch (error) {
      console.error('Error deleting patient:', error);
      return null;
    }
  }

  async assignCareTaker(
    patientNumberList: string[],
    careTakerBig: string,
  ): Promise<any[]> {
    const result = [];
    for (const patientNumber of patientNumberList) {
      try {
        const patient = await this.patientModel
          .findOne({ patientNumber: patientNumber })
          .exec();
        if (!patient) {
          console.warn(`Patient with number ${patientNumber} not found.`);
          continue; // Skip if patient doesn't exist
        }
        patient.careTaker = careTakerBig;
        const updatedPatient = await patient.save();
        result.push(updatedPatient);
      } catch (error) {
        console.error(`Error processing patient ${patientNumber}:`, error);
      }
    }
    console.log('Assign a caretaker', result);
    return result;
  }

  async removeCareTaker(
    patientNumberList: string[],
    careTakerBig: string,
  ): Promise<any[]> {
    const result = [];
    for (const patientNumber of patientNumberList) {
      try {
        const patient = await this.patientModel
          .findOne({ patientNumber })
          .exec();
        if (!patient) {
          console.warn(`Patient with number ${patientNumber} not found.`);
          continue; // Skip if patient doesn't exist
        }
        if (patient.careTaker === careTakerBig) {
          patient.careTaker = null;
          const updatedPatient = await patient.save();
          result.push(updatedPatient);
        } else {
          console.warn(
            `Patient with number ${patientNumber} does not have caretaker ${careTakerBig}`,
          );
        }
      } catch (error) {
        console.error(`Error processing patient ${patientNumber}:`, error);
      }
    }
    console.log('Remove caretaker from patient', result);
    return result;
  }

  async getPatientsByRoom(roomNumber: string): Promise<Patient[]> {
    const room = await this.roomModel.findOne({ roomNumber }).exec();
    if (!room) {
      throw new Error(`Room with roomNumber ${roomNumber} not found`);
    }

    return this.patientModel.find({ room: room._id }).exec();
  }

  async endShift(careTakerBig: string) {
    //find all patients with the careTakerBig and set the careTaker to null
    await this.patientModel
      .updateMany({ careTaker: careTakerBig }, { careTaker: null })
      .exec();
    console.log('Ending shift for caretaker', careTakerBig);

    return { message: 'Shift ended' };
  }

  async getPatientList(): Promise<any[]> {
    const patients = await this.patientModel
      .find()
      .populate('room')
      .select({
        _id: 0,
        isQuarantined: 1,
        patientNumber: 1,
        firstName: 1,
        lastName: 1,
        room: 1,
      })
      .exec();
    return patients.map((patient) => ({
      room: patient.room,
      isQuarantined: patient.isQuarantined,
      patientNumber: patient.patientNumber,
      firstName: patient.firstName,
      lastName: patient.lastName,
    }));
  }

  async getPatientsByClinicalProfile(
    clinicalProfileName: string,
  ): Promise<Patient[]> {
    // 1. Find the clinical profile document by name
    const profile = await this.clinicalProfileModel
      .findOne({ clinicalProfile: clinicalProfileName })
      .exec();

    if (!profile) {
      throw new Error(`ClinicalProfile '${clinicalProfileName}' not found`);
    }

    console.log('Found clinical profile:', profile);

    // 2. Find patients that have this profile's ID within their 'clinicalProfiles' array
    const patients = await this.patientModel
      .find({ clinicalProfiles: { $in: [profile._id] } })
      .populate('room')
      .populate('clinicalProfiles') // Populate the clinicalProfiles array
      .exec();

    console.log('Query used:', { clinicalProfiles: { $in: [profile._id] } });
    console.log('Found patients:', patients);
    return patients;
  }

  async createMedCheck(data: any, patientNumber: string): Promise<MedCheck> {
    const medCheck = new this.medCheckModel(data);
    const resultPatient = await this.patientModel.findOneAndUpdate(
        { patientNumber: patientNumber },
        { $push: { medCheck: medCheck._id } },
        { new: true }
    );
    
    console.log("Dit wordt toegevoegd aan de patient: ",resultPatient);

    return medCheck.save();
    }

}