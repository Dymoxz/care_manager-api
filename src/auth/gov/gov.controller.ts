import { Controller, Get, Query } from '@nestjs/common';
import { GovService } from './gov.service';

@Controller('soap')
export class GovController {
  constructor(private readonly govService: GovService) {}

  @Get('checkBigNumber')
  async checkBigNumber(
    @Query('bigNumber') bigNumber: string,
  ): Promise<any> {
    const args = {
      'RegistrationNumber': bigNumber, // Replace with the actual argument structure required by the SOAP method
    };

    // Call the correct SOAP method (e.g., ListHcpApprox4Async)
    return await this.govService.callMethod('ListHcpApprox4Async', args);
  }
}
