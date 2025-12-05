import { Test, TestingModule } from '@nestjs/testing';
import { ClientServiceController } from './client-service.controller';
import { ClientServiceService } from './client-service.service';

describe('ClientServiceController', () => {
  let controller: ClientServiceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientServiceController],
      providers: [ClientServiceService],
    }).compile();

    controller = module.get<ClientServiceController>(ClientServiceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

