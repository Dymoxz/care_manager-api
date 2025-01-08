import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RoomDocument = HydratedDocument<Room>;

export class Room {
  @Prop({required: true, unique: true})
  roomNumber: number

  @Prop()
  quarantine: boolean

  @Prop()
  floor: number

}

export const RoomSchema = SchemaFactory.createForClass(Room);