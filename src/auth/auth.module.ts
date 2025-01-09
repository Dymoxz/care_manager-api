import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GovService } from '../gov/gov.service';
import { GovModule } from '../gov/gov.module';
import { CareTakerSchema } from '../careTaker/careTaker.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'CareTaker', schema: CareTakerSchema, collection: 'careTakers' }]), GovModule
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
