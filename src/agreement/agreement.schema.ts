import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AgreementDocument = HydratedDocument<Agreement>;

@Schema()
export class Agreement {
  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  title: string;
}

export const AgreementSchema = SchemaFactory.createForClass(Agreement);
