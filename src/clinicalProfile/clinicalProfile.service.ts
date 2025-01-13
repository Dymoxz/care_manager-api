import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClinicalProfile } from './clinicalProfile.schema';

@Injectable()
export class ClinicalProfileService {
  constructor(
    @InjectModel(ClinicalProfile.name) private clinicalProfileModel: Model<ClinicalProfile>,
  ) {}

  async getAll(): Promise<ClinicalProfile[]> {
    const result = await this.clinicalProfileModel.find().exec();
    console.log('Get all rooms', result);
    return result;
  }
}
