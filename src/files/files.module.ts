import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [FilesService, ConfigService],
  controllers: [FilesController],
  imports: [PrismaModule],
  exports: [FilesService],
})
export class FilesModule {}
