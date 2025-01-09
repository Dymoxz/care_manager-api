import { Injectable } from '@nestjs/common';
import { Patient } from './patient.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdatePatientDto } from './patient.dto';
import { Room } from '../room/room.schema';
import { ClinicalProfile } from '../clinicalProfile/clinicalProfile.schema';
import { Medicine } from '../medicine/medicine.schema';

@Injectable()
export class PatientService {
  constructor(
    @InjectModel(Patient.name) private patientModel: Model<Patient>,
    @InjectModel(Room.name) private roomModel: Model<Room>,
    @InjectModel(ClinicalProfile.name)
    private clinicalProfileModel: Model<ClinicalProfile>,
    @InjectModel(Medicine.name) private medicineModel: Model<Medicine>,
  ) {}

  async getAll(): Promise<Patient[]> {
    const patients = await this.patientModel
      .find()
      .populate('room') // Populate room details
      .populate('clinicalProfile') // Populate clinical profile details
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
    const { createPatientDto, roomNumber, clinicalProfile, medicineAtcCodes } =
      data;

    // Get the clinical profile object based on the passed clinicalProfile string
    const defaultProfile = await this.clinicalProfileModel
      .findOne({ clinicalProfile })
      .exec();

    if (!defaultProfile) {
      throw new Error(`ClinicalProfile '${clinicalProfile}' not found`);
    }

    // Create the new patient object
    const newPatient = new this.patientModel({
      ...createPatientDto,
      clinicalProfile: defaultProfile._id, // Set the reference to the ClinicalProfile
      medicineAtcCodes: medicineAtcCodes, // Set the reference to the Medicine
    });

    // Save the patient and assign a room in a single operation
    const savedPatient = await newPatient.save();

    // Assign the room to the patient
    const updatedPatient = await this.assignRoomToPatient(
      savedPatient.patientNumber,
      roomNumber,
    );

    // Return the updated patient data, including populated room and clinicalProfile
    const result = await this.patientModel
      .findOne({ patientNumber: updatedPatient.patientNumber })
      .populate('room')
      .populate('clinicalProfile') // Populate the clinicalProfile field as well
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

  async getPatient(bsn: string): Promise<Patient> {
    const result = this.patientModel
      .findById({ bsn: bsn })
      .populate('room')
      .exec();
    console.log('Get a patient', result);
    return result;
  }

  async updatePatient(
    bsn: string,
    updatePatientDto: UpdatePatientDto,
  ): Promise<Patient> {
    const result = this.patientModel
      .findByIdAndUpdate({ bsn: bsn }, updatePatientDto, { new: true })
      .exec();
    console.log('Update a patient', result);
    return result;
  }

  async getPatientByCaretaker(caretakerBig: string): Promise<Patient[]> {
    const result = this.patientModel
      .find({ caretaker: caretakerBig })
      .populate('room')
      .exec();
    console.log('Get all patients', result);
    return result;
  }

  async deletePatient(bsn: string): Promise<Patient> {
    const result = this.patientModel.findByIdAndDelete({ bsn: bsn }).exec();
    console.log('Delete a patient', result);
    return result;
  }

  async assignCareTaker(
    childrenBsnList: string[],
    careTakerBig: string,
  ): Promise<any[]> {
    const result = [];
    for (const childBsn of childrenBsnList) {
      const patient = await this.patientModel.findOne({ bsn: childBsn }).exec();
      patient.careTaker = careTakerBig;
      const updatedPatient = await patient.save();
      result.push(updatedPatient);
    }
    console.log('Assign a caretaker', result);
    return result;
  }

  async getPatientsByRoom(roomNumber: string): Promise<Patient[]> {
    const room = await this.roomModel.findOne({ roomNumber }).exec();
    if (!room) {
      throw new Error(`Room with roomNumber ${roomNumber} not found`);
    }

    return this.patientModel.find({ room: room._id }).exec();
  }
}