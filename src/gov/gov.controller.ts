import { Controller, Post, Query, Logger } from '@nestjs/common';
import { GovService } from './gov.service';

@Controller('soap')
export class GovController {
  private readonly logger = new Logger(GovController.name);
  constructor(private readonly govService: GovService) {}

  @Post()
  async getHcp(@Query('registrationNumber') registrationNumber: string) {
    //console.log('Get number ' + registrationNumber);
    //this.logger.debug("Dit is de controller: ", await this.govService.validateBigNumber(registrationNumber));
    return await this.govService.validateBigNumber(registrationNumber);
  }
}
