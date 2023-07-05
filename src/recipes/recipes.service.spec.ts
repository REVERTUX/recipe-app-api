import { Test, TestingModule } from '@nestjs/testing';
import { RecipesService } from './recipes.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RecipesRepository } from './recipes.repository';
import { PrismaMongoModule } from 'src/prisma/prismaMongo.module';

describe('RecipesService', () => {
  let service: RecipesService;

  beforeEach(async () => {
    jest.resetModules();

    const module: TestingModule = await Test.createTestingModule({
      providers: [RecipesService, RecipesRepository],
      imports: [PrismaModule, PrismaMongoModule],
    }).compile();

    service = module.get<RecipesService>(RecipesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
