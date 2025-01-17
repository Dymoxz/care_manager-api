import { Controller, Get } from '@nestjs/common';
import { ClinicalProfileService } from './clinicalProfile.service';
import { ClinicalProfile } from './clinicalProfile.schema';

@Controller('clinicalProfile')
export class ClinicalProfileController {
  constructor(private readonly clinicalProfileService: ClinicalProfileService) {}

  @Get()
  async getAll(): Promise<ClinicalProfile[]> {
    return this.clinicalProfileService.getAll();
  }
}
