import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { CreateUserDto } from "src/users/dto/createUser.dto";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signIn(email: string, pass: string) {
    const [user] = await this.usersService.findOne([{ email }]);

    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, username: user.username };

    const access_token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get("JWT_SECRET"),
    });

    return { access_token };
  }

  async register(user: CreateUserDto) {
    const isEmailInUse = await this.usersService.findOne([
      {
        email: user.email,
      },
      { username: user.username },
    ]);

    if (isEmailInUse.length > 1)
      throw new ConflictException("Email or username is already in use.");

    const { email, password } = await this.usersService.create(user);

    return await this.signIn(email, password);
  }

  async updatePassword(email: string, newPassword: string) {
    const updatedRows = await this.usersService.update(
      { email },
      { email, password: newPassword },
    );

    if (updatedRows.length < 1)
      throw new NotFoundException("User not found. Rows weren't updated");

    return updatedRows[0];
  }
}
