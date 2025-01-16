import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { RoomService } from './room.service';
import { Room } from './room.schema';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Get()
  async getAll(): Promise<Room[]> {
    return this.roomService.getAll();
  }

  @Put()
  async scaleRoom(
    @Body() body: { roomNumber: number, floor: number },
  ): Promise<any> {
    console.log('Scale a room', body);
    return this.roomService.scaleRoom(body);
  }
}
