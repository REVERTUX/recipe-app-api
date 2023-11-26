import { Test, TestingModule } from '@nestjs/testing';
import { RecipesService } from './recipes.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RecipesRepository } from './recipes.repository';
import { MongooseModule } from '@nestjs/mongoose';

describe('RecipesService', () => {
  let service: RecipesService;

  beforeEach(async () => {
    jest.resetModules();

    const module: TestingModule = await Test.createTestingModule({
      providers: [RecipesService, RecipesRepository],
      imports: [PrismaModule, MongooseModule],
    }).compile();

    service = module.get<RecipesService>(RecipesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
