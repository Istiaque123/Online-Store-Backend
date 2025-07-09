import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from "node:process";
import {config} from "dotenv";
config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1')
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
