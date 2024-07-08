import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard, Public } from "./auth.guard";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "src/users/dto/createUser.dto";
import { LoginUserDto } from "./dto/login.dto";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post("login")
  signIn(@Body() signInDto: LoginUserDto) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @Public()
  @Post("register")
  register(@Body() signInDto: CreateUserDto) {
    console.log(signInDto);
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @UseGuards(AuthGuard)
  @Get("test")
  getProfile(@Request() req) {
    return req.user;
  }
}
