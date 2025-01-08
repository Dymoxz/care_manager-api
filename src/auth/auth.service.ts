import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CareTaker } from './careTaker.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(CareTaker.name) private careTakerModel: Model<CareTaker>,
  ) {}

  // Check if the user already exists in the database
  // If the user exists, return false
  // else make a call to the government API to check if the user is a valid care taker
  // If the user is a valid care taker, return true

  async activate(big: number): Promise<boolean> {
    const userExists = await this.userExists(big);
    if (userExists) {
      return false;
    }

    const validCareTaker = await this.validCareTaker(big);
    if (validCareTaker) {
      return true;
    }
    return false;
  }

  async userExists(big: number): Promise<boolean> {
    const user = await this.careTakerModel.findOne({ big: big }).exec();
    if (user) {
      //user exists so he already is logged in on a different device
      return true;
    }
    return false;
  }

  async validCareTaker(big: number): Promise<boolean> {
    return false;
  }
}
