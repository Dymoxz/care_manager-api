import { Controller, Get, Post, Query } from '@nestjs/common';
import { GovService } from './gov.service';

@Controller('soap')
export class GovController {
  constructor(private readonly govService: GovService) {}

  @Post('hcp')
  async getHcp(@Query('registrationNumber') registrationNumber: string) {
    console.log('Get HCP' + registrationNumber);
    return await this.govService.listHcpApprox(registrationNumber);
  }
}
