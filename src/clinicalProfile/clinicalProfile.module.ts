import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ClinicalProfile,
  ClinicalProfileSchema,
} from './clinicalProfile.schema';
import { clinicalProfileController } from './clinicalProfile.controller';
import { ClinicalProfileService } from './clinicalProfile.service';

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
  controllers:[clinicalProfileController],
  providers:[ClinicalProfileService],
  exports: [MongooseModule],
})
export class ClinicalProfileModule {}
