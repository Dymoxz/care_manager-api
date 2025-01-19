import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MedCheckDocument = HydratedDocument<MedCheck>;


@Schema({ timestamps: true })
export class MedCheck{
  @Prop({required: true })
  description: string;

  @Prop({required: true})
  heartRate: number;
  
  @Prop({required: true})
  bloodPressure: string;
}


export const MedCheckSchema = SchemaFactory.createForClass(MedCheck);