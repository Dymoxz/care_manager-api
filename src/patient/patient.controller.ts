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

    @Put('/caretTaker/:careTakerBig')
    async assignCaretTaker(@Param('careTakerBig') careTakerBig: string, @Body() patientNumberList: string[]): Promise<any[]> {
        console.log('Assign a caretaker');
        return this.patientService.assignCareTaker(patientNumberList, careTakerBig);
    }

    @Get('/caretTaker/:caretakerBig')
    async getPatientByCaretaker(@Param('caretakerBig') caretakerBig: string): Promise<Patient[]> {
        console.log('Get all patients by caretaker');
        return this.patientService.getPatientByCaretaker(caretakerBig);
    }

    @Delete(':patientNumber')
    async deletePatient(@Param('patientNumber') patientNumber: string): Promise<Patient> {
        console.log('Delete a patient');
        return this.patientService.deletePatient(patientNumber);
    }

    @Get('/room/:roomNumber')
    async getPatientByRoom(@Param('roomNumber') roomNumber: string): Promise<Patient> {
        console.log('Get a patient by room');
        return this.patientService.getPatientByRoom(roomNumber);
    }
}
