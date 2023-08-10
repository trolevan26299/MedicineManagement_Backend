import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // swagger
  const config = new DocumentBuilder()
    .setTitle('Pharmacy management APIs')
    .setDescription('List APIs for simple pharmacy management by Dev')
    .setVersion('1.0')
    .addTag('Auth')
    .addTag('Users')
    .addTag('Medicines')
    .addTag('Categorys')
    .addTag('Customers')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  //end set up swagger
  app.enableCors();
  app.use(express.static('.')); // định vị lại đường dẫn để load tài nguyên

  await app.listen(8080);
}
bootstrap();
