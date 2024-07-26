import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard, Public } from "./auth.guard";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "src/users/dto/createUser.dto";
import { LoginUserDto } from "./dto/login.dto";
import { OtpService } from "src/otp/otp.service";
import { EmailParam, ValidateOTPBody } from "src/otp/dto/validateOTP.dto";
import { UpdatePasswordDto } from "./dto/updatePassword.dto";

@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly otpService: OtpService,
  ) {}

  @Public()
  @Post("login")
  signIn(@Body() signInDto: LoginUserDto) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @Public()
  @Post("register")
  register(@Body() signInDto: CreateUserDto) {
    return this.authService.register(signInDto);
  }

  @Public()
  @Patch("update-password/:email")
  async updateUserPassword(
    @Param() { email }: EmailParam,
    @Body() { newPassword, updatePasswordToken }: UpdatePasswordDto,
  ) {
    const isTokenValid =
      await this.otpService.validateUpdatePasswordToken(updatePasswordToken);
    if (!isTokenValid) return new ForbiddenException("Token is not valid");
    return await this.authService.updatePassword(email, newPassword);
  }

  @Public()
  @Get("code/receive/:email")
  async getResetCode(@Param() { email }: EmailParam) {
    await this.otpService.generateOtp(email);
    return { message: "OTP sent to thee email" };
  }

  @Public()
  @Post("code/validate/:email")
  async validateOtp(
    @Param() { email }: EmailParam,
    @Body() { otp }: ValidateOTPBody,
  ) {
    const isValid = await this.otpService.validateOtp(email, otp);
    const updatePasswordToken =
      await this.otpService.getChangePasswordToken(email);
    return { isValid, updatePasswordToken };
  }

  @UseGuards(AuthGuard)
  @Get("test")
  getProfile(@Request() req) {
    return { message: "you're accepted" };
  }
}
