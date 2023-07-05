import { Module } from '@nestjs/common';
import { PrismaMongoService } from './prismaMongo.service';

@Module({
  providers: [PrismaMongoService],
  exports: [PrismaMongoService],
})
export class PrismaMongoModule {}
