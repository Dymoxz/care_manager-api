import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {PatientModule} from "./patient/patient.module";
import {MongooseModule} from "@nestjs/mongoose";
import { environment } from '../environment';
import { MedicineModule } from './medicine/medicine.module';
import { GovModule } from './gov/gov.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    PatientModule,
    GovModule,
    MedicineModule,
    AuthModule,
    MongooseModule.forRoot(environment.MONGO_URL),
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
