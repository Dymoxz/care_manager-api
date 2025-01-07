import { Controller, Get } from '@nestjs/common';
import { MedicineService } from './medicine.service';
import { Medicine } from './medicine.schema';

@Controller('medicine')
export class MedicineController {
  constructor(private readonly medicineService: MedicineService) {}

  @Get()
  async getAll(): Promise<Medicine[]> {
    return this.medicineService.getAll();
  }
}
