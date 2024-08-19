import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UserEntity } from "./users.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OtpEntity } from "../otp/otp.entity";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, OtpEntity])],
  providers: [UsersService, UserEntity],
  exports: [UsersService, UserEntity],
})
export class UsersModule {}
