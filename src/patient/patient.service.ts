import { Injectable } from '@nestjs/common';
import { Patient } from './patient.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePatientDto, UpdatePatientDto } from './patient.dto';

@Injectable()
export class PatientService {
  constructor(
    @InjectModel(Patient.name) private patientModel: Model<Patient>,
  ) {}

  async getAll(): Promise<Patient[]> {
    const result = await this.patientModel.find().exec();
    console.log('Get all patients', result);
    return result;
  }

  async createPatient(createPatientDto: CreatePatientDto): Promise<Patient> {
    const newPatient = new this.patientModel(createPatientDto);
    const result = await newPatient.save();
    console.log('Create a patient', result);
    return result;
  }

  async getPatient(bsn: string): Promise<Patient> {
    const result = this.patientModel.findById({ bsn: bsn }).exec();
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
    const result = this.patientModel.find({ caretaker: caretakerBig }).exec();
    console.log('Get all patients', result);
    return result;
  }

  async deletePatient(bsn: string): Promise<Patient> {
    const result = this.patientModel.findByIdAndDelete({ bsn: bsn }).exec();
    console.log('Delete a patient', result);
    return result;
  }

  async assignCareTaker(childrenBsnList: string[], careTakerBig: string): Promise<any[]> {
    const result = [];
    for (const childBsn of childrenBsnList) {
        const patient = await this.patientModel.findOne
        ({ bsn: childBsn }).exec();
        patient.careTaker = careTakerBig;
        const updatedPatient = await patient.save();
        result.push(updatedPatient);
    }
    console.log('Assign a caretaker', result);
    return result;
  }
}