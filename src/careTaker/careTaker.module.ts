import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CareTaker, CareTakerSchema } from './careTaker.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: CareTaker.name,
        schema: CareTakerSchema,
        collection: 'careTakers',
      },
    ]),
  ],
  exports: [MongooseModule],
})
export class CareTakerModule {}
