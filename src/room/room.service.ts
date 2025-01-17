import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
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

  async scaleRoom(data: any): Promise<Room | null> {
    console.log(`Updating room with roomNumber: ${data.roomNumber}`);
    console.log('isScaled', data.isScaled);
    const result = await this.roomModel.findOneAndUpdate(
      { roomNumber: data.roomNumber, floor: data.floor },
      { $set: {isScaled: true} },
      { new:true },
    );
    console.log('result', result);
    return result
  }
}
