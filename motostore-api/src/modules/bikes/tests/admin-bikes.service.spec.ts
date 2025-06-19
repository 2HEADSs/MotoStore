import { Test, TestingModule } from '@nestjs/testing';
import { AdminBikesService } from './admin-bikes.service';

describe('AdminBikesService', () => {
  let service: AdminBikesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminBikesService],
    }).compile();

    service = module.get<AdminBikesService>(AdminBikesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
