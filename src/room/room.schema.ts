import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RoomDocument = HydratedDocument<Room>;

@Schema()
export class Room {
  @Prop({ type: Number, required: true})
  roomNumber: number

  @Prop({ type: Number, required: true})
  floor: number

  @Prop( {type: Number, required: true} )
  maxCapacity: number

  @Prop({ type: Boolean, default: false})
  isScaled: boolean
}

export const RoomSchema = SchemaFactory.createForClass(Room);