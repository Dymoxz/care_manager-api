import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {PatientModule} from "./patient/patient.module";
import {MongooseModule} from "@nestjs/mongoose";
import { environment } from '../environment';

@Module({
  imports: [PatientModule,
  MongooseModule.forRoot(environment.MONGO_URL)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
