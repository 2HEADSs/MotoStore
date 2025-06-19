import { Test, TestingModule } from '@nestjs/testing';
import { AdminBikesController } from '../controllers/admin-bikes.controller';

describe('AdminBikesController', () => {
  let controller: AdminBikesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminBikesController],
    }).compile();

    controller = module.get<AdminBikesController>(AdminBikesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
