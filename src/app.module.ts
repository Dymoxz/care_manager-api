import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {PatientModule} from "./patient/patient.module";
import {MongooseModule} from "@nestjs/mongoose";
import { environment } from '../environment';
import { GovModule } from './auth/gov/gov.module';
import { MedicineModule } from './medicine/medicine.module';

@Module({
  imports: [
    PatientModule,
    GovModule,
    MedicineModule,
    MongooseModule.forRoot(environment.MONGO_URL),
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
