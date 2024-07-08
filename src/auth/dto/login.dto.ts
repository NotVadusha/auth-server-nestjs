import { IsNotEmpty, IsString } from "class-validator";

export class LoginUserDto {
  @IsString()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
