import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
const cors = require('cors');
const corsOption = {
  origin: ['http://localhost:3000'],
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cors(corsOption));
  app.use(cookieParser());
  await app.listen(4000);
}
bootstrap();
