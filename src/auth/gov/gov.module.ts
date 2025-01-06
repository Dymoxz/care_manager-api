import { Module } from '@nestjs/common';
import { SoapModule } from 'nestjs-soap';
import { GovService } from './gov.service';
import { GovController } from './gov.controller';

@Module({
  imports: [
    // Register the SOAP client with the WSDL URL
    SoapModule.register({
      clientName: 'MY_SOAP_CLIENT',
      uri: 'https://api.bigregister.nl/zksrv/soap/4?wsdl',
    }),
  ],
  controllers: [GovController],
  providers: [GovService],
})
export class GovModule {}
