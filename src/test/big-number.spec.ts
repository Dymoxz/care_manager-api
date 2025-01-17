import { Test, TestingModule } from '@nestjs/testing';
import { GovController } from '../gov/gov.controller';
import { GovService } from '../gov/gov.service';

describe('GovController', () => {
  let controller: GovController;
  let service: GovService;

  beforeEach(async () => {
    const mockGovService = {
      validateBigNumber: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [GovController],
      providers: [{ provide: GovService, useValue: mockGovService }],
    }).compile();

    controller = module.get<GovController>(GovController);
    service = module.get<GovService>(GovService);
  });

  it('should return an object when a valid registrationNumber is provided', async () => {
    const registrationNumber = '79059994401';
    const mockResult = {
      BirthSurname: 'Bakers',
      Initial: 'J.',
      Big_Number: registrationNumber,
    };

    jest.spyOn(service, 'validateBigNumber').mockResolvedValue(mockResult);

    const result = await controller.getHcp(registrationNumber);

    expect(service.validateBigNumber).toHaveBeenCalledWith(registrationNumber);
    expect(result).toEqual(mockResult);
  });

  it('should return "Niets gevonden" when an invalid registrationNumber is provided', async () => {
    const registrationNumber = '987654321';
    const mockResult = 'Niets gevonden';

    jest.spyOn(service, 'validateBigNumber').mockResolvedValue(mockResult);

    const result = await controller.getHcp(registrationNumber);

    expect(service.validateBigNumber).toHaveBeenCalledWith(registrationNumber);
    expect(result).toBe(mockResult);
  });
});