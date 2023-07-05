import { Injectable, OnModuleInit, INestApplication } from '@nestjs/common';
import { PrismaClientMongo } from '@prismany/client';

@Injectable()
export class PrismaMongoService
  extends PrismaClientMongo
  implements OnModuleInit
{
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
