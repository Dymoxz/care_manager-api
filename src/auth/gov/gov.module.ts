import { Module } from '@nestjs/common';
import { SoapModule } from 'nestjs-soap';
import { GovController } from './gov.controller';
import { GovService } from './gov.service';

@Module({
  imports: [
    SoapModule.register({
      clientName: 'BIG_REGISTER',
      uri: 'https://api.bigregister.nl/zksrv/soap/4?wsdl',
    /*  clientOptions: {
        forceSoap11: true,
      },*/
    }),
  ],
  controllers: [GovController],
  providers: [GovService],
})
export class GovModule {}