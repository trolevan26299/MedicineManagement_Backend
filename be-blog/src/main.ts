import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // swagger
  const config = new DocumentBuilder()
    .setTitle('Blog APIs')
    .setDescription('List APIs for simple blog by Dev')
    .setVersion('1.0')
    .addTag('Auth')
    .addTag('Users')
    .addTag('Posts')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  //end set up swagger
  app.enableCors();
  await app.listen(8080);
}
bootstrap();
