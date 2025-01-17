import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Room, RoomSchema } from './room.schema';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Room', schema: RoomSchema, collection: 'rooms' }]),
  ],
  controllers: [RoomController],
  providers: [RoomService],
  exports: [MongooseModule],
})
export class RoomModule {}
