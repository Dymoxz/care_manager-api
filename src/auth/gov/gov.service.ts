import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Client } from 'nestjs-soap';

@Injectable()
export class GovService implements OnModuleInit {
  private readonly logger = new Logger(GovService.name);

  constructor(@Inject('BIG_REGISTER') private readonly soapClient: Client) {}

  async onModuleInit() {
    if (this.soapClient) {
/*      this.soapClient.wsdl.xmlnsInEnvelope =
        'xmlns:ext="http://services.cibg.nl/ExternalUser"';*/
      this.soapClient.wsdl.options = {
        ...this.soapClient.wsdl.options,
        envelopeKey: 'soapenv',
      };
    }
  }

    async listHcpApprox(registrationNumber: string) {
    try {
      const soapRequest = this.generateSoapRequest(registrationNumber);

      this.logger.debug('SOAP request XML:', soapRequest);

      const response = await new Promise((resolve, reject) => {
        this.soapClient.ListHcpApprox4(soapRequest, (err, res, body, header) => {
          if (err) {
            console.log(err);
            this.logger.error('SOAP error:', err.message || 'Unknown error');
            reject(new Error(err.message || 'SOAP request failed'));
          } else {
            this.logger.debug('SOAP response received:', res);
            resolve(res);
          }
        });
      });
      return response;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`SOAP request failed: ${errorMessage}`);
      throw new Error(errorMessage);
    }
  }


  private generateSoapRequest(registrationNumber: string): string {
    return `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ext="http://services.cibg.nl/ExternalUser">
        <soapenv:Header/>
        <soapenv:Body>
           <ext:listHcpApproxRequest>
              <ext:RegistrationNumber>${registrationNumber}</ext:RegistrationNumber>
           </ext:listHcpApproxRequest>
        </soapenv:Body>
      </soapenv:Envelope>
    `;
  }
}
