import { Test, TestingModule } from '@nestjs/testing';
import { PatientService } from '../patient.service';
import { getModelToken } from '@nestjs/mongoose';
import { Patient } from '../patient.schema';
import { Room } from '../../room/room.schema';
import { ClinicalProfile } from '../../clinicalProfile/clinicalProfile.schema';
import { Medicine } from '../../medicine/medicine.schema';
import { MedCheck } from '../../medcheck/medcheck.schema';

describe('PatientService', () => {
    let service: PatientService;
    const patientModelMock = {
        find: jest.fn(),
        findOne: jest.fn(),
        findByIdAndUpdate: jest.fn(),
        findOneAndDelete: jest.fn(),
        updateMany: jest.fn(),
        findOneAndUpdate: jest.fn(),
        create: jest.fn(),
        save: jest.fn()
    };

    const roomModelMock = {
        findOne: jest.fn(),
        findByIdAndUpdate: jest.fn(),
    };

    const clinicalProfileModelMock = {
        findOne: jest.fn(),
    };

    const medicineModelMock = {
        find: jest.fn(),
    };

   const medCheckModelMock = {
       create: jest.fn(),
       save: jest.fn(),
       constructor: jest.fn(function(data) {
         this.data = data;
         this.save = jest.fn().mockResolvedValue(data)
       }),
   };
   medCheckModelMock.constructor.mockImplementation((data) => {
        return {
            ...data,
            save: jest.fn().mockResolvedValue(data)
        }
    })

    const mockPatient: Patient = {
        patientNumber: 12345,
        firstName: 'John',
        lastName: 'Doe',
        isQuarantined: false,
        careTaker: null,
        clinicalProfiles: [],
        medicineAtcCodes: ['ATC1', 'ATC2'],
        medChecks: [],
        room: null,
        bsn: '1234567890',
        dateOfBirth: new Date('1990-01-01'),
        length: 180,
        weight: 80,
        gender: 'male',
        agreements: [],
        diet: ''
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
            room: null,
            bsn: '1234567890',
            dateOfBirth: new Date('1990-01-01'),
            length: 180,
            weight: 80,
            gender: 'male',
            agreements: [],
            diet:''
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
            room: null,
            bsn: '0987654321',
            dateOfBirth: new Date('1995-05-10'),
            length: 165,
            weight: 60,
            gender: 'female',
            agreements: [],
            diet: ''
        } as Patient
    ];

    const mockRoom = {
        _id: 'room_id',
        roomNumber: 1
    }

    const mockClinicalProfile = {
        _id: 'profile_id',
        clinicalProfile: 'Profile1'
    }

    const mockMedicine = [
        { atcCode: 'ATC1', name: 'Medicine 1' },
        { atcCode: 'ATC2', name: 'Medicine 2' },
    ];

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
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PatientService,
                {
                    provide: getModelToken(Patient.name),
                    useValue: patientModelMock,
                },
                {
                    provide: getModelToken(Room.name),
                    useValue: roomModelMock,
                },
                {
                    provide: getModelToken(ClinicalProfile.name),
                    useValue: clinicalProfileModelMock,
                },
                {
                    provide: getModelToken(Medicine.name),
                    useValue: medicineModelMock,
                },
                {
                    provide: getModelToken(MedCheck.name),
                    useValue: medCheckModelMock,
                },
            ],
        }).compile();

        service = module.get<PatientService>(PatientService);

        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });


    describe('getAll', () => {
        it('should return all patients with populated data', async () => {
            patientModelMock.find.mockReturnValue({
                populate: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(mockPatientList),
            });
            medicineModelMock.find.mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockMedicine),
            });
            const result = await service.getAll();

            expect(result).toEqual(mockPatientList);
            expect(patientModelMock.find).toHaveBeenCalled();
        });
    });

    describe('getPatient', () => {
        it('should return null if no patient is found', async () => {
            patientModelMock.findOne.mockReturnValue({
                populate: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(null),
            });
            const result = await service.getPatient('non_existent');
            expect(result).toBeNull();
        });
    });

    describe('getPatientByCaretaker', () => {
        it('should return a list of patients by caretaker', async () => {
            patientModelMock.find.mockReturnValue({
                populate: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(mockPatientList)
            });

            const result = await service.getPatientByCaretaker('79059994401');
            expect(result).toEqual(mockPatientList);
            expect(patientModelMock.find).toHaveBeenCalledWith({ careTaker: '79059994401' });
        });
    });

    describe('deletePatient', () => {
        it('should return null if no patient is found', async () => {
            patientModelMock.findOneAndDelete.mockReturnValue({
                exec: jest.fn().mockResolvedValue(null)
            });
            const result = await service.deletePatient('non_existent');
            expect(result).toBeNull();
        });
    });

    describe('assignCareTaker', () => {
        it('should assign a caretaker to multiple patients', async () => {
            patientModelMock.findOne.mockReturnValue({
                exec: jest.fn().mockResolvedValue({...mockPatient, save: jest.fn().mockResolvedValue(mockPatient)}),
            });

            const patientNumberList = [12345, 67890];
            const result = await service.assignCareTaker(patientNumberList.map((patientNumber) => (patientNumber.toString())), '79059994401');

            expect(result).toEqual([mockPatient, mockPatient]);
            expect(patientModelMock.findOne).toHaveBeenCalledTimes(2);
        });

        it('should skip patients that are not found', async () => {
            patientModelMock.findOne.mockReturnValue({
                exec: jest.fn().mockResolvedValue(null),
            });
            const patientNumberList = [12345, 67890];
            const result = await service.assignCareTaker(patientNumberList.map((patientNumber) => (patientNumber.toString())), '79059994401');
            expect(result).toEqual([]);
            expect(patientModelMock.findOne).toHaveBeenCalledTimes(2);
        });
    });

    describe('removeCareTaker', () => {
        it('should skip patients that are not found', async () => {
            patientModelMock.findOne.mockReturnValue({
                exec: jest.fn().mockResolvedValue(null)
            });
            const patientNumberList = [12345, 67890];
            const result = await service.removeCareTaker(patientNumberList.map((patientNumber) => (patientNumber.toString())), '79059994401');
            expect(result).toEqual([]);
            expect(patientModelMock.findOne).toHaveBeenCalledTimes(2);
        });

        it('should skip patients that dont have the caretaker', async () => {
            patientModelMock.findOne.mockReturnValue({
                exec: jest.fn().mockResolvedValue({...mockPatient, careTaker: "otherCareTaker", save: jest.fn().mockResolvedValue(mockPatient)}),
            });
            const patientNumberList = [12345, 67890];
            const result = await service.removeCareTaker(patientNumberList.map((patientNumber) => (patientNumber.toString())), '79059994401');
            expect(result).toEqual([]);
            expect(patientModelMock.findOne).toHaveBeenCalledTimes(2);
        });
    });

    describe('endShift', () => {
        it('should set the caretaker to null for all patients', async () => {
            patientModelMock.updateMany.mockReturnValue({
                exec: jest.fn().mockResolvedValue(null),
            });
            const result = await service.endShift('79059994401');
            expect(result).toEqual({ message: 'Shift ended' });
            expect(patientModelMock.updateMany).toHaveBeenCalledWith(
                { careTaker: '79059994401' },
                { careTaker: null },
            );
        });
    });

    describe('getPatientList', () => {
        it('should return a patient list with room information', async () => {
            patientModelMock.find.mockReturnValue({
                populate: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue([
                    {
                        isQuarantined: false,
                        patientNumber: 12345,
                        firstName: "John",
                        lastName: "Doe",
                        room: { roomNumber: 1 },
                    },
                    {
                        isQuarantined: true,
                        patientNumber: 67890,
                        firstName: "Jane",
                        lastName: "Smith",
                        room: { roomNumber: 2 },
                    },
                ])
            });
            const result = await service.getPatientList();
            expect(result).toEqual([
                {
                    isQuarantined: false,
                    patientNumber: 12345,
                    firstName: 'John',
                    lastName: 'Doe',
                    room: { roomNumber: 1 },
                },
                {
                    isQuarantined: true,
                    patientNumber: 67890,
                    firstName: 'Jane',
                    lastName: 'Smith',
                    room: { roomNumber: 2 },
                },
            ]);
            expect(patientModelMock.find).toHaveBeenCalled();
        });
    });
});