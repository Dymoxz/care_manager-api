import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Room } from '../room/room.schema';
import { Agreement } from '../agreement/agreement.schema';
import { ClinicalProfile } from '../clinicalProfile/clinicalProfile.schema';

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

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'ClinicalProfile' })
    clinicalProfile: ClinicalProfile;

    @Prop()
    diet: string;

    @Prop()
    careTaker: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Room' })
    room: Room;

    @Prop({ type: [Agreement], default: [] }) // Embedded Agreement schemas
    agreements: Agreement[]

    @Prop()
    isQuarantined: boolean
}

export const PatientSchema = SchemaFactory.createForClass(Patient);