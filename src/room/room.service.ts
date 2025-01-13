import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Room } from './room.schema';

@Injectable()
export class RoomService {
  constructor(
    @InjectModel(Room.name) private roomModel: Model<Room>,
  ) {}

  async getAll(): Promise<Room[]> {
    const result = await this.roomModel.find().exec();
    console.log('Get all rooms', result);
    return result;
  }
}