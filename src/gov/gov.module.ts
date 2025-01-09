import { Module } from '@nestjs/common';
import { SoapModule } from 'nestjs-soap';
import { GovController } from './gov.controller';
import { GovService } from './gov.service';

@Module({
  imports: [
    SoapModule.register({
      clientName: 'BIG_REGISTER',
      uri: 'https://api.bigregister.nl/zksrv/soap/4?wsdl',
    }),
  ],
  controllers: [GovController],
  providers: [GovService],
  exports: [GovService]
})
export class GovModule {}