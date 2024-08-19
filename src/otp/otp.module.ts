import { Module } from "@nestjs/common";
import { OtpService } from "./otp.service";
import { UsersModule } from "src/users/users.module";

@Module({
  imports: [UsersModule],
  providers: [OtpService],
  controllers: [],
})
export class OtpModule {}
