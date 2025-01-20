import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Post,
    Put,
} from '@nestjs/common';
import { PatientService } from './patient.service';
import { Patient } from './patient.schema';
import { CreatePatientDto, UpdatePatientDto } from './patient.dto';

@Controller('patient')
export class PatientController {
    constructor(private readonly patientService: PatientService) {}

    @Get()
    async getAll(): Promise<Patient[]> {
        console.log('Get all patients');
        return this.patientService.getAll();
    }

    @Get('list')
    async getPatientList(): Promise<any[]> {
        console.log('Get a patient list');
        return this.patientService.getPatientList();
    }

    @Post()
    async createPatient(@Body() body: { createPatientDto: any; roomNumber: number }): Promise<Patient> {
        console.log('Create a patient with room assignment');
        return this.patientService.createPatient(body);
    }

    @Get(':patientNumber')
    async getPatient(@Param('patientNumber') patientNumber: string): Promise<Patient> {
        console.log('Get a patient');
        return this.patientService.getPatient(patientNumber);
    }

    @Put(':patientNumber')
    async updatePatient(@Param('patientNumber') patientNumber: string, @Body() updatePatientDto: UpdatePatientDto): Promise<Patient> {
        console.log('Update a patient');
        return this.patientService.updatePatient(patientNumber, updatePatientDto);
    }

    @Post('/careTaker/:careTakerBig')
    async assignCaretTaker(
      @Param('careTakerBig') careTakerBig: string,
      @Body() body: { patientNumberList: string[] },
    ): Promise<any[]> {
        const { patientNumberList } = body;

        if (!Array.isArray(patientNumberList) || patientNumberList.length === 0) {
            throw new BadRequestException('Invalid or empty patientNumberList');
        }

        console.log('Assigning caretaker', careTakerBig);
        return this.patientService.assignCareTaker(patientNumberList, careTakerBig);
    }


    @Get('/careTaker/:caretakerBig')
    async getPatientByCaretaker(@Param('caretakerBig') caretakerBig: string): Promise<Patient[]> {
        console.log('Get all patients by caretaker');
        return this.patientService.getPatientByCaretaker(caretakerBig);
    }

    @Delete('/careTaker/:careTakerBig')
    async deleteCareaTaker(
      @Param('careTakerBig') careTakerBig: string,
      @Body() body: { patientNumberList: string[] },
    ): Promise<any[]> {
        const { patientNumberList } = body;

        if (!Array.isArray(patientNumberList) || patientNumberList.length === 0) {
            throw new BadRequestException('Invalid or empty patientNumberList');
        }

        console.log('Removing caretaker from patient', careTakerBig);
        return this.patientService.removeCareTaker(patientNumberList, careTakerBig);
    }

    @Delete('/endShift/:careTakerBig')
    async endShift(@Param('careTakerBig') careTakerBig: string): Promise<any> {
        console.log('Ending shift for caretaker', careTakerBig);
        return this.patientService.endShift(careTakerBig);
    }

    @Delete(':patientNumber')
    async deletePatient(@Param('patientNumber') patientNumber: string): Promise<Patient> {
        console.log('Delete a patient');
        const deletedPatient = await this.patientService.deletePatient(patientNumber);
        if (!deletedPatient) {
            throw new NotFoundException('Patient not found');
        }
        return deletedPatient;
    }


    @Get('/room/:roomNumber')
    async getPatientByRoom(@Param('roomNumber') roomNumber: string): Promise<Patient[]> {
        console.log('Get a patient by room');
        return this.patientService.getPatientsByRoom(roomNumber);
    }

    @Get('/clinicalProfile/:clinicalProfile')
    async getPatientByClinicalProfile(
      @Param('clinicalProfile') clinicalProfile: string
    ): Promise<Patient[]> {
        console.log('Get a patient by clinical profile');
        return this.patientService.getPatientsByClinicalProfile(clinicalProfile);
    }

    @Post("/medcheck/:patientNumber")
    async createMedCheck(
        @Body() body: { data:any },
        @Param('patientNumber') patientNumber: string
      ): Promise<any> {
        return this.patientService.createMedCheck(body, patientNumber);
      }


      @Post("/agreement/:patientNumber")
      async getMedChecks(@Param('patientNumber') patientNumber: string, @Body() body: {data: any}): Promise<any> {
        return this.patientService.addAgreementToPatient(patientNumber, body);
      }

      //switchQuarantineStatus
      @Put('/quarantine/:patientNumber')
      async switchQuarantineStatus(@Param('patientNumber') patientNumber: string): Promise<Patient> {
          console.log('Switch quarantine status');
          return this.patientService.switchQuarantineStatus(patientNumber);
      }

}
