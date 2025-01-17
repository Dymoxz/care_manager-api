import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MedCheck, MedCheckSchema } from './medcheck.schema';


@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MedCheck.name,
        schema: MedCheckSchema,
        collection: 'medicalChecks',
      },
    ]),
  ],
  controllers:[],
  providers:[],
  exports: [MongooseModule],
})
export class MedCheckModule {}