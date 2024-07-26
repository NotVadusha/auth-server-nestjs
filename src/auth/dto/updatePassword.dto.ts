import { IsJWT, IsNotEmpty, IsString } from "class-validator";

export class UpdatePasswordDto {
  @IsNotEmpty()
  @IsString()
  newPassword: string;

  @IsNotEmpty()
  @IsJWT()
  updatePasswordToken: string;
}
