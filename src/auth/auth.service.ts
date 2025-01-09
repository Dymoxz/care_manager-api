import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CareTaker } from './careTaker.schema';
import { GovService } from '../gov/gov.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(CareTaker.name) private careTakerModel: Model<CareTaker>,
    private readonly govService: GovService, // Inject GovService
  ) {}

  // Check if the user already exists in the database
  // If the user exists, return an empty object
  // If the user is a valid care taker, return the care taker data
  async activate(big: string): Promise<object> {
    // Check if the user already exists in the database
    console.log(big)
    const userExists = await this.userExists(big);
    if (userExists) {
      return {}; // Return an empty object if user exists
    }

    // If the user doesn't exist, check the government system
    const govResponse = await this.isValidCareTaker(big);

    if (govResponse === 'Niets gevonden') {
      return {}; // Return empty object if the care taker is not valid
    } else if (govResponse && typeof govResponse === 'object') {
      return govResponse; // Return the care taker data if valid
    } else {
      return {}; // Return empty object for any invalid response
    }
  }

  // Check if a user already exists in the database
  async userExists(big: string): Promise<boolean> {
    const user = await this.careTakerModel.findOne({ big: big }).exec();
    return !!user; // Return true if user exists, false otherwise
  }

  // Validate if the care taker exists using GovService
  async isValidCareTaker(big: string): Promise<string | object | null> {
    try {
      console.log(big)
      const result = await this.govService.validateBigNumber(big);
      return result !== 'Niets gevonden' ? result : 'Niets gevonden'; // Return result if valid or 'Niets gevonden' if not
    } catch (error) {
      return null; // Return null in case of any error with the government service
    }
  }
}
