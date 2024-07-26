import { IsEmail, IsNotEmpty, IsNumber } from "class-validator";

export class ValidateOTPBody {
  @IsNotEmpty()
  @IsNumber()
  otp: number;
}

export class EmailParam {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
