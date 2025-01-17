import { Test, TestingModule } from '@nestjs/testing';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Room } from './room.schema';

describe('RoomController', () => {
  let controller: RoomController;
  let service: RoomService;
  let roomModel: Model<Room>;

  const mockRoom = {
    roomNumber: 101,
    floor: 1,
    isScaled: false,
    maxCapacity: 3,
  };

  const mockRoomData = [
    { roomNumber: 101, floor: 1, isScaled: false, maxCapacity: 3 },
    { roomNumber: 102, floor: 1, isScaled: false, maxCapacity: 2  },
    { roomNumber: 103, floor: 2, isScaled: true, maxCapacity: 1 },
  ];

  beforeEach(async () => {
    const mockRoomService = {
      getAll: jest.fn(),
      scaleRoom: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomController],
      providers: [
        { provide: RoomService, useValue: mockRoomService },
        {
          provide: getModelToken(Room.name),
          useValue: {
            find: jest.fn(),
            findOneAndUpdate: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<RoomController>(RoomController);
    service = module.get<RoomService>(RoomService);
    roomModel = module.get<Model<Room>>(getModelToken(Room.name));
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return an array of rooms when getAll is called', async () => {
    jest.spyOn(service, 'getAll').mockResolvedValue(mockRoomData);

    const result = await controller.getAll();

    expect(service.getAll).toHaveBeenCalled();
    expect(result).toEqual(mockRoomData);
  });

  it('should call scaleRoom and return an updated room', async () => {
    const body = { roomNumber: 101, floor: 1, maxCapacity: 3};
    const updatedRoom = { ...mockRoom, isScaled: true };
    jest.spyOn(service, 'scaleRoom').mockResolvedValue(updatedRoom);
    const result = await controller.scaleRoom(body);
    expect(service.scaleRoom).toHaveBeenCalledWith(body);
    expect(result).toEqual(updatedRoom);
  });

  it('should return null if no room is updated', async () => {
    const body = { roomNumber: 404, floor: 5 };
    jest.spyOn(service, 'scaleRoom').mockResolvedValue(null);
    const result = await controller.scaleRoom(body);
    expect(service.scaleRoom).toHaveBeenCalledWith(body);
    expect(result).toEqual(null);
  });
});
