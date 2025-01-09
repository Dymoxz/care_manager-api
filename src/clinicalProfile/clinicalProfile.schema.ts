import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ClinicalProfileDocument = HydratedDocument<ClinicalProfile>;


@Schema()
export class ClinicalProfile{
  @Prop({unique: true, required: true })
  clinicalProfile: string
}


export const ClinicalProfileSchema = SchemaFactory.createForClass(ClinicalProfile);