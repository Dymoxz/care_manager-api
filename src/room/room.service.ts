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

  async scaleRoom(body: { roomNumber: number, floor: number }): Promise<any> {
    const { roomNumber, floor } = body;
    console.log('Scale room', roomNumber);
    console.log('Scale floor', floor);
    const filter = { roomNumber, floor };
    const update = { $set: { isScaled: true } };


    const result = await this.roomModel.findOneAndUpdate(
      filter,
      update,
      { new: true, runValidators: true }
    ).exec();

    console.log('Update Result:', result);

    return result;
  }
}
