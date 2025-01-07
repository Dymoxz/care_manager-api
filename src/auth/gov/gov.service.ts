import { Inject, Injectable, Logger } from '@nestjs/common';
import { Client } from 'nestjs-soap';

@Injectable()
export class GovService {
  private readonly logger = new Logger(GovService.name);

  constructor(@Inject('BIG_REGISTER') private readonly client: Client) {}

  async validateBigNumber(registrationNumber: string): Promise<any> {
    this.logger.log('Validating number ' + registrationNumber);
    this.client.setSOAPAction('http://services.cibg.nl/ExternalUser/ListHcpApprox4');
    //this.logger.debug(this.client.getHttpHeaders());
    //Logging the client services
    //this.logger.debug("client services: " + JSON.stringify(this.client.describe(), null, 2));
    //_xml: is to replace the whoel xml body
    return this.client.ListHcpApprox4Async({
      _xml:`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ext="http://services.cibg.nl/ExternalUser">
              <soapenv:Body>
                  <ext:listHcpApproxRequest>
                    <ext:RegistrationNumber>${registrationNumber}</ext:RegistrationNumber>
                  </ext:listHcpApproxRequest>
              </soapenv:Body>
            </soapenv:Envelope> `
    }).then((response) => {
      //this.logger.debug(response[0]);
      
      if(response[0].ListHcpApprox != null)
      {
        //this.logger.debug(response[0].ListHcpApprox.ListHcpApprox4[0]);
        const result = {
          BirthSurname: response[0].ListHcpApprox.ListHcpApprox4[0].BirthSurname,
          Initial: response[0].ListHcpApprox.ListHcpApprox4[0].Initial,
          Big_Number: registrationNumber
        };
        
        //this.logger.debug("Dit moet het object zijn: " , result);
        return result;
      }
      //this.logger.error('Geen resultaat gevonden');
      return 'Niets gevonden';
    });
  }
}