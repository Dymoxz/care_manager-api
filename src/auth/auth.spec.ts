import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth/auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CareTaker } from '../careTaker/careTaker.schema';
import { GovService } from '../gov/gov.service';

describe('AuthService', () => {
  let service: AuthService;
  let careTakerModel: Model<CareTaker>;
  let govService: GovService;

  const mockGovResponse = {
    BirthSurname: 'Doe',
    Initial: 'J.',
    Big_Number: '12345678901',
  };
  const mockBigNumber = '12345678901';

  const mockGovService = {
    validateBigNumber: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: GovService, useValue: mockGovService },
        {
          provide: getModelToken(CareTaker.name),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn().mockResolvedValue({}), // Corrected this line
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    govService = module.get<GovService>(GovService);
    careTakerModel = module.get<Model<CareTaker>>(
      getModelToken(CareTaker.name),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('activate', () => {
    it('should return an empty object if user already exists', async () => {
      jest.spyOn(service, 'userExists').mockResolvedValue(true);
      const result = await service.activate(mockBigNumber);
      expect(service.userExists).toHaveBeenCalledWith(mockBigNumber);
      expect(result).toEqual({});
    });

    it('should return an empty object if the care taker is not valid', async () => {
      jest.spyOn(service, 'userExists').mockResolvedValue(false);
      jest.spyOn(service, 'isValidCareTaker').mockResolvedValue('Niets gevonden');
      const result = await service.activate(mockBigNumber);
      expect(service.userExists).toHaveBeenCalledWith(mockBigNumber);
      expect(service.isValidCareTaker).toHaveBeenCalledWith(mockBigNumber);
      expect(result).toEqual({});
    });

    it('should return the caretaker data if valid', async () => {
      jest.spyOn(service, 'userExists').mockResolvedValue(false);
      jest.spyOn(service, 'isValidCareTaker').mockResolvedValue(mockGovResponse);
      jest.spyOn(service, 'login').mockImplementation(()=> jest.fn())
      const result = await service.activate(mockBigNumber);
      expect(service.userExists).toHaveBeenCalledWith(mockBigNumber);
      expect(service.isValidCareTaker).toHaveBeenCalledWith(mockBigNumber);
      expect(service.login).toHaveBeenCalledWith(mockBigNumber);
      expect(result).toEqual(mockGovResponse);
    });

    it('should return empty object if isValidCareTaker throws an error', async () => {
      jest.spyOn(service, 'userExists').mockResolvedValue(false);
      jest.spyOn(service, 'isValidCareTaker').mockResolvedValue(null);
      const result = await service.activate(mockBigNumber);
      expect(service.userExists).toHaveBeenCalledWith(mockBigNumber);
      expect(service.isValidCareTaker).toHaveBeenCalledWith(mockBigNumber);
      expect(result).toEqual({});
    });

  });
});