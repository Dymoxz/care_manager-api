import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CareTakerSchema } from './careTaker.schema';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'CareTaker', schema: CareTakerSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class PatientModule {}
