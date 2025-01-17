import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ClinicalProfile,
  ClinicalProfileSchema,
} from './clinicalProfile.schema';
import { ClinicalProfileController } from './clinicalProfile.controller';
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
  controllers:[ClinicalProfileController],
  providers:[ClinicalProfileService],
  exports: [MongooseModule],
})
export class ClinicalProfileModule {}
