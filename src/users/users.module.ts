import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UserEntity } from "./users.entity";

@Module({
  imports: [UserEntity],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
