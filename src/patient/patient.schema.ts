import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Room } from '../room/room.schema';

export type PatientDocument = HydratedDocument<Patient>;

@Schema({timestamps: true})
export class Patient {
    @Prop({required: true, unique: true})
    patientNumber: number

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

}

export const PatientSchema = SchemaFactory.createForClass(Patient);