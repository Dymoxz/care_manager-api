import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MedicineSchema } from './medicine.schema';
import { MedicineService } from './medicine.service';
import { MedicineController } from './medicine.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Medicine', schema: MedicineSchema }]),
  ],
  controllers: [MedicineController],
  providers: [MedicineService],
})
export class MedicineModule {}
