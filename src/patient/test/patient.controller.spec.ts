import { Test, TestingModule } from '@nestjs/testing';
import { PatientController } from '../patient.controller';
import { PatientService } from '../patient.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Patient } from '../patient.schema';
import { CreatePatientDto, UpdatePatientDto } from '../patient.dto';


describe('PatientController', () => {
  let controller: PatientController;
  let service: PatientService;

  const mockPatient: Patient = {
    patientNumber: 12345,
    firstName: 'John',
    lastName: 'Doe',
    isQuarantined: false,
    careTaker: null,
    clinicalProfiles: [],
    medicineAtcCodes: [],
    medChecks: [],
    room: null
  } as Patient;

  const mockPatientList: Patient[] = [
      {
        patientNumber: 12345,
        firstName: 'John',
        lastName: 'Doe',
        isQuarantined: false,
        careTaker: null,
        clinicalProfiles: [],
        medicineAtcCodes: [],
        medChecks: [],
        room: null
      } as Patient,
      {
        patientNumber: 67890,
        firstName: 'Jane',
        lastName: 'Smith',
        isQuarantined: true,
        careTaker: null,
        clinicalProfiles: [],
        medicineAtcCodes: [],
        medChecks: [],
        room: null
      } as Patient
  ];

  const mockPatientListWithRoom: any[] = [
    {
      isQuarantined: false,
      patientNumber: "12345",
      firstName: "John",
      lastName: "Doe",
      room: { roomNumber: 1 }
    },
    {
      isQuarantined: true,
      patientNumber: "67890",
      firstName: "Jane",
      lastName: "Smith",
      room: { roomNumber: 2 }
    }
  ]

  const mockCreatePatientDto: CreatePatientDto = {
      firstName: "John",
      lastName: "Doe",
      patientNumber: 12345,
      bsn: '',
      dateOfBirth: undefined,
      length: 0,
      weight: 0,
      clinicalProfile: '',
      diet: '',
  }

    const mockUpdatePatientDto: UpdatePatientDto = {
        firstName: "Updated",
        lastName: "Doe",
    }

    const mockMedCheck = {
      data: {
          "bloodPressure": {
              "systolic": 120,
              "diastolic": 80
          },
          "heartRate": 70,
          "temperature": 37
      }
  }

  beforeEach(async () => {
    const mockPatientService = {
      getAll: jest.fn().mockResolvedValue(mockPatientList),
      getPatientList: jest.fn().mockResolvedValue(mockPatientListWithRoom),
      createPatient: jest.fn().mockResolvedValue(mockPatient),
      getPatient: jest.fn().mockResolvedValue(mockPatient),
      updatePatient: jest.fn().mockResolvedValue(mockPatient),
      assignCareTaker: jest.fn().mockResolvedValue([mockPatient]),
        removeCareTaker: jest.fn().mockResolvedValue([mockPatient]),
      getPatientByCaretaker: jest.fn().mockResolvedValue(mockPatientList),
      deletePatient: jest.fn().mockResolvedValue(mockPatient),
        endShift: jest.fn().mockResolvedValue({message: "Shift ended"}),
        getPatientsByRoom: jest.fn().mockResolvedValue(mockPatientList),
        getPatientsByClinicalProfile: jest.fn().mockResolvedValue(mockPatientList),
        createMedCheck: jest.fn().mockResolvedValue(mockMedCheck),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PatientController],
      providers: [{ provide: PatientService, useValue: mockPatientService }],
    }).compile();

    controller = module.get<PatientController>(PatientController);
    service = module.get<PatientService>(PatientService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array of patients', async () => {
      const result = await controller.getAll();
      expect(result).toEqual(mockPatientList);
      expect(service.getAll).toHaveBeenCalled();
    });
  });

  describe('getPatientList', () => {
    it('should return an array of patients', async () => {
      const result = await controller.getPatientList();
      expect(result).toEqual(mockPatientListWithRoom);
      expect(service.getPatientList).toHaveBeenCalled();
    });
  });

  describe('createPatient', () => {
    it('should create a patient and return it', async () => {
        const roomNumber = 1;
        const result = await controller.createPatient({ createPatientDto: mockCreatePatientDto, roomNumber });
      expect(result).toEqual(mockPatient);
      expect(service.createPatient).toHaveBeenCalledWith({ createPatientDto: mockCreatePatientDto, roomNumber });
    });
  });

  describe('getPatient', () => {
    it('should return a patient by patientNumber', async () => {
        const patientNumber = '12345';
      const result = await controller.getPatient(patientNumber);
      expect(result).toEqual(mockPatient);
      expect(service.getPatient).toHaveBeenCalledWith(patientNumber);
    });
  });

  describe('updatePatient', () => {
    it('should update a patient and return it', async () => {
        const patientNumber = '12345';
      const result = await controller.updatePatient(patientNumber, mockUpdatePatientDto);
      expect(result).toEqual(mockPatient);
      expect(service.updatePatient).toHaveBeenCalledWith(patientNumber, mockUpdatePatientDto);
    });
  });

  describe('assignCareTaker', () => {
    it('should assign a caretaker to a list of patients and return it', async () => {
      const careTakerBig = '79059994401';
      const patientNumberList = ['12345'];
      const result = await controller.assignCaretTaker(careTakerBig, {patientNumberList});
      expect(result).toEqual([mockPatient]);
        expect(service.assignCareTaker).toHaveBeenCalledWith(patientNumberList, careTakerBig)
    });

    it('should throw BadRequestException when patientNumberList is invalid', async () => {
      const careTakerBig = '79059994401';
      await expect(controller.assignCaretTaker(careTakerBig, {patientNumberList: []})).rejects.toThrowError(BadRequestException);
      await expect(controller.assignCaretTaker(careTakerBig, {patientNumberList: null})).rejects.toThrowError(BadRequestException);
    });
  });

  describe('getPatientByCaretaker', () => {
    it('should return a list of patients by caretaker', async () => {
      const careTakerBig = '79059994401';
      const result = await controller.getPatientByCaretaker(careTakerBig);
      expect(result).toEqual(mockPatientList);
      expect(service.getPatientByCaretaker).toHaveBeenCalledWith(careTakerBig);
    });
  });

    describe('deleteCareaTaker', () => {
      it('should remove a caretaker from a list of patients', async () => {
        const careTakerBig = '79059994401';
        const patientNumberList = ['12345'];
        const result = await controller.deleteCareaTaker(careTakerBig, {patientNumberList});
          expect(result).toEqual([mockPatient]);
          expect(service.removeCareTaker).toHaveBeenCalledWith(patientNumberList, careTakerBig)
      });

      it('should throw BadRequestException when patientNumberList is invalid', async () => {
        const careTakerBig = '79059994401';
        await expect(controller.deleteCareaTaker(careTakerBig, {patientNumberList: []})).rejects.toThrowError(BadRequestException);
        await expect(controller.deleteCareaTaker(careTakerBig, {patientNumberList: null})).rejects.toThrowError(BadRequestException);
      });
    });


    describe('endShift', () => {
    it('should end shift for a caretaker and return message', async () => {
        const careTakerBig = '79059994401';
        const result = await controller.endShift(careTakerBig);
        expect(result).toEqual({message: "Shift ended"});
      expect(service.endShift).toHaveBeenCalledWith(careTakerBig);
    });
  });

    describe('deletePatient', () => {
        it('should delete a patient and return it', async () => {
            const patientNumber = '12345';
            const result = await controller.deletePatient(patientNumber);
            expect(result).toEqual(mockPatient);
            expect(service.deletePatient).toHaveBeenCalledWith(patientNumber);
        });

        it('should throw NotFoundException when patient is not found', async () => {
            const patientNumber = 'not_found';
            jest.spyOn(service, 'deletePatient').mockResolvedValue(null);
            await expect(controller.deletePatient(patientNumber)).rejects.toThrowError(NotFoundException);
        });
    });

    describe('getPatientByRoom', () => {
        it('should return a list of patients by roomNumber', async () => {
            const roomNumber = '1';
            const result = await controller.getPatientByRoom(roomNumber);
            expect(result).toEqual(mockPatientList);
            expect(service.getPatientsByRoom).toHaveBeenCalledWith(roomNumber);
        });
    });

    describe('getPatientByClinicalProfile', () => {
        it('should return a list of patients by clinicalProfile', async () => {
            const clinicalProfile = 'Profile1';
            const result = await controller.getPatientByClinicalProfile(clinicalProfile);
            expect(result).toEqual(mockPatientList);
            expect(service.getPatientsByClinicalProfile).toHaveBeenCalledWith(clinicalProfile);
        });
    });

    describe('createMedCheck', () => {
      it('should create a medCheck and return it', async () => {
        const patientNumber = '12345';
          const result = await controller.createMedCheck({ data: mockMedCheck.data }, patientNumber);
        expect(result).toEqual(mockMedCheck);
        expect(service.createMedCheck).toHaveBeenCalledWith({data: mockMedCheck.data}, patientNumber);
      });
    });
});