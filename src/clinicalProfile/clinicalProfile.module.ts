import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ClinicalProfile,
  ClinicalProfileSchema,
} from './clinicalProfile.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ClinicalProfile.name,
        schema: ClinicalProfileSchema,
        collection: 'clinicalProfiles',
      },
    ]),
  ],
  exports: [MongooseModule],
})
export class ClinicalProfileModule {}
