import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";

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

export class NameParam {
  @IsNotEmpty()
  @IsString()
  name: string;
}
