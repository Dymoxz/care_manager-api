import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Room } from '../room/room.schema';

export type MedicineDocument = HydratedDocument<Medicine>;

@Schema()
export class Medicine {
  @Prop({required: true, unique: true})
  medicineName: string

}

export const MedicineSchema = SchemaFactory.createForClass(Medicine);