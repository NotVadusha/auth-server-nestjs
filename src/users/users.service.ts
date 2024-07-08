import { Inject, Injectable } from "@nestjs/common";
import { UserEntity } from "./users.entity";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/createUser.dto";

export type User = any;

@Injectable()
export class UsersService {
  private readonly users = [
    {
      userId: 1,
      username: "john",
      password: "changeme",
    },
    {
      userId: 2,
      username: "maria",
      password: "guess",
    },
  ];

  constructor(
    @Inject("PHOTO_REPOSITORY")
    private userEntity: Repository<UserEntity>,
  ) {}

  async create(userData: CreateUserDto) {
    return this.userEntity.create(userData);
  }

  async findOne(email: string): Promise<User | undefined> {
    return this.userEntity.find({
      where: {
        email: email,
      },
    });
  }
}
