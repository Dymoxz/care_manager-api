import { Injectable } from '@nestjs/common';
import { Patient } from './patient.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePatientDto, UpdatePatientDto } from './patient.dto';
import { Room } from '../room/room.schema';
import { ClinicalProfile } from '../clinicalProfile/clinicalProfile.schema';

@Injectable()
export class PatientService {
  constructor(
    @InjectModel(Patient.name) private patientModel: Model<Patient>,
    @InjectModel(Room.name) private roomModel: Model<Room>,
    @InjectModel(ClinicalProfile.name) private clinicalProfileModel: Model<ClinicalProfile>,
  ) {}

  async getAll(): Promise<Patient[]> {
    const result = await this.patientModel.find().populate('room').populate('clinicalProfile').exec();
    console.log('Get all patients', result);
    return result;
  }

  async createPatient(data: any): Promise<Patient> {
    const { createPatientDto, roomNumber, clinicalProfile } = data;

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
    });

    // Save the patient and assign a room in a single operation
    const savedPatient = await newPatient.save();

    // Assign the room to the patient
    const updatedPatient = await this.assignRoomToPatient(savedPatient.patientNumber, roomNumber);

    // Return the updated patient data, including populated room and clinicalProfile
    const result = await this.patientModel
      .findOne({ patientNumber: updatedPatient.patientNumber })
      .populate('room')
      .populate('clinicalProfile') // Populate the clinicalProfile field as well
      .exec();

    console.log('Created patient', result);
    return result;
  }

  async assignRoomToPatient(patientNumber: number, roomNumber: number): Promise<Patient> {
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