import { Injectable, Logger } from '@nestjs/common';
import { FileDto } from './file.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FilesService {
  constructor(private prisma: PrismaService) {}

  private readonly logger = new Logger(FilesService.name);

  async saveFileData(fileData: FileDto) {
    const { filename, mimetype, path } = fileData;

    this.logger.log(`Saving filename ${filename} to db`);

    const data = await this.prisma.file.create({
      data: { filename, mimetype, path },
      select: { id: true },
    });

    this.logger.log(
      `Saved filename ${filename} to db and created file ${data.id}`,
    );
    return data;
  }

  async removeFileData(fileId: string) {
    this.logger.log(`Removing file ${fileId} from db`);

    const data = await this.prisma.file.delete({ where: { id: fileId } });

    this.logger.log(`Removed file ${fileId} from db`);

    return data;
  }

  async getFile(fileId: string) {
    return await this.prisma.file.findFirstOrThrow({ where: { id: fileId } });
  }
}
