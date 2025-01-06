import { Inject, Injectable } from '@nestjs/common';
import { Client } from 'nestjs-soap';

@Injectable()
export class GovService {
  constructor(@Inject('MY_SOAP_CLIENT') private readonly mySoapClient: Client) {}

  async callMethod(methodName: string, args: any): Promise<any> {
    try {
      // Log available methods for debugging
      console.log('Available methods:', Object.keys(this.mySoapClient));

      // Log arguments for debugging
      console.log('Calling method:', methodName);
      console.log('With arguments:', args);

      // Check if the method exists on the SOAP client
      if (!this.mySoapClient[methodName]) {
        throw new Error(`Method ${methodName} does not exist on the SOAP client.`);
      }

      // Call the method dynamically
      const result = await this.mySoapClient[methodName](args);

      // Log the SOAP response for debugging
      console.log('SOAP response:', result);

      return result;
    } catch (error) {
      console.error('Error calling SOAP method:', error.message);
      throw new Error(`SOAP method call failed: ${error.message}`);
    }
  }
}
