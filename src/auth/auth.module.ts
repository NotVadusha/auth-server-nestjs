import { UsersModule } from "src/users/users.module";
import { APP_GUARD } from "@nestjs/core";
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AuthGuard } from "./auth.guard";
import { ConfigModule } from "@nestjs/config";
import { OtpModule } from "src/otp/otp.module";

const DAY_IN_SECONDS = 86400;

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET_PHRASE,
      signOptions: { expiresIn: `${DAY_IN_SECONDS * 28}s` },
    }),
    ConfigModule,
    OtpModule,
  ],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
