import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //TODO: ConfigService + @Global

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Motostore API')
    .setDescription('The Motostore API description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      // Подреждаме секциите точно както искаме
      tagsSorter: (a: string, b: string) => {
        const order = [
          'App',
          'Auth',
          'Bikes',
          'Users',
          'AdminUsers',
          'AdminBikes',
        ];
        return order.indexOf(a) - order.indexOf(b);
      },
    },
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
