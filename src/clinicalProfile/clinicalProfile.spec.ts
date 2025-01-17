import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClinicalProfileService } from './clinicalProfile.service';
import { ClinicalProfile } from './clinicalProfile.schema';
import { ClinicalProfileController } from './clinicalProfile.controller';

describe('ClinicalProfileController', () => {
  let controller: ClinicalProfileController;
  let service: ClinicalProfileService;
  let clinicalProfileModel: Model<ClinicalProfile>;

  const mockClinicalProfileData = [
    { clinicalProfile: 'Cardiology' },
    { clinicalProfile: 'Oncology' },
    { clinicalProfile: 'Neurology' },
  ];

  beforeEach(async () => {
    const mockClinicalProfileService = {
      getAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClinicalProfileController],
      providers: [
        { provide: ClinicalProfileService, useValue: mockClinicalProfileService },
        {
          provide: getModelToken(ClinicalProfile.name),
          useValue: {
            find: jest.fn()
          }
        }
      ],
    }).compile();

    controller = module.get<ClinicalProfileController>(ClinicalProfileController);
    service = module.get<ClinicalProfileService>(ClinicalProfileService);
    clinicalProfileModel = module.get<Model<ClinicalProfile>>(getModelToken(ClinicalProfile.name));
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });


  it('should return an array of clinical profiles when getAll is called', async () => {
    jest.spyOn(service, 'getAll').mockResolvedValue(mockClinicalProfileData);

    const result = await controller.getAll();

    expect(service.getAll).toHaveBeenCalled();
    expect(result).toEqual(mockClinicalProfileData);
  });
});