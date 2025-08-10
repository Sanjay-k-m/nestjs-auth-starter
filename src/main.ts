import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  // 1. Create app instance first
  const app = await NestFactory.create(AppModule);

  // 2. Enable CORS after app creation
  const corsOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000')
    .split(',')
    .map((origin) => origin.trim());
  app.enableCors({
    origin: corsOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // 3. Use helmet middleware conditionally
  if (process.env.ENABLE_HELMET !== 'false') {
    app.use(helmet());
    console.log('Helmet enabled');
  } else {
    console.log('Helmet disabled');
  }

  // 4. Setup swagger conditionally
  if (process.env.ENABLE_SWAGGER === 'true') {
    const config = new DocumentBuilder()
      .setTitle('Ecommerce API')
      .setDescription('API docs for ecommerce backend')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);
    console.log('Swagger enabled at /api-docs');
  } else {
    console.log('Swagger disabled');
  }

  // 5. Listen on port
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Server listening on http://localhost:${port}`);
}

bootstrap();
