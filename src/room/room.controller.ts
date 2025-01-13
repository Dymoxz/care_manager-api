import { Controller, Get } from '@nestjs/common';
import { RoomService } from './room.service';
import { Room } from './room.schema';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Get()
  async getAll(): Promise<Room[]> {
    return this.roomService.getAll();
  }
}
