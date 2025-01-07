import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
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
    async createPatient(@Body() createPatientDto: CreatePatientDto): Promise<Patient> {
        console.log('Create a patient');
        return this.patientService.createPatient(createPatientDto);
    }

    @Get(':bsn')
    async getPatient(@Param() bsn: string): Promise<Patient> {
        console.log('Get a patient');
        return this.patientService.getPatient(bsn);
    }

    @Put(':bsn')
    async updatePatient(@Param() bsn: string, @Body() updatePatientDto: UpdatePatientDto): Promise<Patient> {
        console.log('Update a patient');
        return this.patientService.updatePatient(bsn, updatePatientDto);
    }

    @Put('/caretTaker/:careTakerBig')
    async assignCaretTaker(@Param() careTakerBig: string, @Body() patientBsnList: string[]): Promise<any[]> {
        console.log('Assign a caretaker');
        return this.patientService.assignCareTaker(patientBsnList, careTakerBig);
    }

    @Get('/caretTaker/:caretakerBig')
    async getPatientByCaretaker(@Param() caretakerBig: string): Promise<Patient[]> {
        console.log('Get all patients');
        return this.patientService.getPatientByCaretaker(caretakerBig);
    }

    @Delete(':bsn')
    async deletePatient(@Param() bsn: string): Promise<Patient> {
        console.log('Delete a patient');
        return this.patientService.deletePatient(bsn);
    }

}