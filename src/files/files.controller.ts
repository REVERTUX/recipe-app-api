import {
  Controller,
  Get,
  Post,
  Param,
  Res,
  UseInterceptors,
  UploadedFile,
  HttpStatus,
  ParseFilePipeBuilder,
  StreamableFile,
  Header,
  Delete,
} from '@nestjs/common';
import { createReadStream } from 'fs';
import { Response } from 'express';

import LocalFilesInterceptor from './files.interceptor';
import { FilesService } from './files.service';

const FILE_MAX_SIZE = 1024 * 1024 * 10; // 10MB

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('')
  @UseInterceptors(
    LocalFilesInterceptor({
      fieldName: 'file',
      path: '',
    }),
  )
  createFile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /jpeg|jpg|png/,
        })
        .addMaxSizeValidator({ maxSize: FILE_MAX_SIZE })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    )
    file: Express.Multer.File,
  ) {
    const { filename, mimetype } = file;
    return this.filesService.saveFileData({
      filename,
      mimetype,
      path: '',
    });
  }

  @Get(':id')
  @Header('Cache-Control', 'max-age=15552000')
  async getFile(
    @Param('id') id: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const file = await this.filesService.getFile(id);

    const stream = createReadStream(
      `${process.env.UPLOADED_FILES_DESTINATION}/${file.filename}`,
    );

    response.set({
      'Content-Disposition': `inline; filename="${file.filename}"`,
      'Content-Type': file.mimetype,
    });

    return new StreamableFile(stream);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.filesService.removeFileData(id);
  }
}
