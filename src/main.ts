import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
      disableErrorMessages: false,
    }),
  );
  const configService = app.get(ConfigService);

  app.enableCors({
    credentials: true,
    origin: configService.get("origins.web"),
  });
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
