import { Test, TestingModule } from '@nestjs/testing';
import { MedicineController } from './medicine.controller';
import { MedicineService } from './medicine.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Medicine } from './medicine.schema';

describe('MedicineController', () => {
  let controller: MedicineController;
  let service: MedicineService;
  let medicineModel: Model<Medicine>;

  const mockMedicineData = [
    { atcCode: 'N02BE01'},
    { atcCode: 'N02BE02'},
    { atcCode: 'N02BE03'},
  ];

  beforeEach(async () => {
    const mockMedicineService = {
      getAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MedicineController],
      providers: [
        { provide: MedicineService, useValue: mockMedicineService },
        {
          provide: getModelToken(Medicine.name),
          useValue: {
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MedicineController>(MedicineController);
    service = module.get<MedicineService>(MedicineService);
    medicineModel = module.get<Model<Medicine>>(getModelToken(Medicine.name));
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return an array of medicines when getAll is called', async () => {
    jest.spyOn(service, 'getAll').mockResolvedValue(mockMedicineData);

    const result = await controller.getAll();

    expect(service.getAll).toHaveBeenCalled();
    expect(result).toEqual(mockMedicineData);
  });
});
