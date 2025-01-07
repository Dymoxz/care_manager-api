import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Medicine } from './medicine.schema';

@Injectable()
export class MedicineService {
  constructor(
    @InjectModel(Medicine.name) private medicineModel: Model<Medicine>,
  ) {}

  async getAll(): Promise<Medicine[]> {
    const result = await this.medicineModel.find().exec();
    console.log('Get all medicines', result);
    return result;
  }
}
