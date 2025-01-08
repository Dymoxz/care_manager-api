import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Room } from '../room/room.schema';

export type AgreementDocument = HydratedDocument<Agreement>;

@Schema({ timestamps: true })
export class Agreement {
  @Prop({ required: true, unique: true })
  patientNumber: number;

  @Prop()
  bsn: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  dateOfBirth: Date;

  @Prop()
  length: number;

  @Prop()
  weight: number;

  @Prop()
  clinicalProfile: string;

  @Prop()
  diet: string;

  @Prop()
  careTaker: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Room' })
  room: Room;

  @Prop({ type: [Agreement], default: [] })
  agreements: Agreement[];
}

export const AgreementSchema = SchemaFactory.createForClass(Agreement);