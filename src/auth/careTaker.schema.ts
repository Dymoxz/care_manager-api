import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CareTakerDocument = HydratedDocument<CareTaker>;


@Schema()
export class CareTaker {
    @Prop({required: true, unique: true})
    big: number
}

export const CareTakerSchema = SchemaFactory.createForClass(CareTaker);