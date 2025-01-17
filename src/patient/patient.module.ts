import {Module} from '@nestjs/common';
import {PatientController} from "./patient.controller";
import {PatientService} from "./patient.service";
import {MongooseModule} from "@nestjs/mongoose";
import {PatientSchema} from "./patient.schema";
import { RoomModule } from '../room/room.module';
import { ClinicalProfileModule } from '../clinicalProfile/clinicalProfile.module';
import { MedicineModule } from '../medicine/medicine.module';
import { MedCheck } from 'src/medcheck/medcheck.schema';
import { MedCheckModule } from 'src/medcheck/medcheck.module';

@Module({
    imports: [
        MongooseModule.forFeature([{
            name: 'Patient', 
            schema: PatientSchema, 
            collection: 'patients'}]), 
            RoomModule, 
            ClinicalProfileModule, 
            MedicineModule,
            MedCheckModule,

    ],
    controllers: [PatientController],
    providers: [PatientService],
})
export class PatientModule {
}
