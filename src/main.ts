import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Care Manager API')
    .setDescription('The Care Manager API description')
    .setVersion('1.0')
    .addTag('care-manager')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);


  Logger.log(`Server running on http://localhost:${process.env.PORT ?? 3000}`, 'Bootstrap');
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
