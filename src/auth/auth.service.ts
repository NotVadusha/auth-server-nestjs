import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { CreateUserDto } from "src/users/dto/createUser.dto";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string) {
    const [user] = await this.usersService.findOne(email);

    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, username: user.username };

    const access_token = await this.jwtService.signAsync(payload, {
      secret: "secret",
    });

    return { access_token };
  }

  async register(user: CreateUserDto) {
    const isEmailInUse = await this.usersService.findOne(user.email);

    if (isEmailInUse.length > 1)
      throw new ConflictException("This email is already in use.");

    const { email, password } = await this.usersService.create(user);

    return await this.signIn(email, password);
  }
}
