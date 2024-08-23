import { NestFactory, Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as morgan from 'morgan'
import { AppModule } from './app.module';
import { CORS } from './constants';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// funcion inicializadora
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(morgan('dev'))

  app.useGlobalPipes(
    new ValidationPipe({
      transformOptions:{
        enableImplicitConversion: true
      }
    })
  )

  // lineas de codigo para excluir un atributo de una entidad
  const reflector = app.get(Reflector)
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector))

  const configService = app.get(ConfigService)

  app.enableCors(CORS)
  app.setGlobalPrefix('api')

  const config = new DocumentBuilder()
    .setTitle('Taskrr API')
    .setDescription('Aplicacion de gestion de tareas')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  
  await app.listen(configService.get('PORT'));

  console.log(`Application runnig on: ${await app.getUrl()}`);
  
}
bootstrap();
