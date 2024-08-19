import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
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

  @UseGuards(AuthGuard)
  @Get("test")
  getProfile(@Request() req) {
    return { message: "you're accepted" };
  }

  @Public()
  @Patch("update-password/:email")
  async updateUserPassword(
    @Param("email") email: string,
    @Body("password") newPassword: string,
    @Body("updatePasswordToken") updatePasswordToken: string,
  ) {
    const isTokenValid =
      await this.otpService.validateUpdatePasswordToken(updatePasswordToken);
    if (!isTokenValid) return new ForbiddenException("Token is not valid");
    return await this.authService.updatePassword(email, newPassword);
  }

  @Public()
  @Get("code/receive/:email")
  async getResetCode(@Param("email") email: string) {
    await this.otpService.generateOtp(email);
    return { message: "OTP sent to thee email" };
  }

  @Public()
  @Post("code/validate/:email")
  async validateOtp(@Param("email") email: string, @Body("otp") otp: number) {
    const isValid = await this.otpService.validateOtp(email, otp);
    const updatePasswordToken =
      await this.otpService.getChangePasswordToken(email);
    return { isValid, updatePasswordToken };
  }
}
