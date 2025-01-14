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
}
