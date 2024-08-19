import { Module } from "@nestjs/common";
import { OtpService } from "./otp.service";
import { UsersModule } from "src/users/users.module";
import { EmailModule } from "src/email/email.module";
import { ScheduleModule } from "@nestjs/schedule";
import { OtpEntity } from "./otp.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "src/users/users.entity";
import { JwtModule } from "@nestjs/jwt";
import { HOUR_IN_SECONDS } from "src/constants/timeConstants";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: `${HOUR_IN_SECONDS * 28}s` },
    }),
    TypeOrmModule.forFeature([OtpEntity, UserEntity]),
    EmailModule,
    ScheduleModule.forRoot(),
  ],
  providers: [OtpService],
  exports: [OtpService],
  controllers: [],
})
export class OtpModule {}
