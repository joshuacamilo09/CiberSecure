import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { LoggerInterceptor } from './common/interceptors/logger.interceptor';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { PrismaService } from 'prisma/prisma.service';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new LoggerInterceptor(), new ResponseInterceptor());

  const config = new DocumentBuilder()
    .setTitle('PSP Cyber Support API')
    .setDescription(
      'API da plataforma de apoio, triagem e encaminhamento para ciberbullying',
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const prismaService = app.get(PrismaService);
  await prismaService.$connect();

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`Server running on http://localhost:${port}/api/v1`);
  console.log(`Swagger docs on http://localhost:${port}/api/docs`);
}
bootstrap();
