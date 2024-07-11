import { Inject, Injectable } from "@nestjs/common";
import { UserEntity } from "./users.entity";
import { FindOptionsWhere, Repository } from "typeorm";
import { CreateUserDto } from "./dto/createUser.dto";
import { InjectRepository } from "@nestjs/typeorm";

export type User = any;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userEntity: Repository<UserEntity>,
  ) {}

  async create(userData: CreateUserDto) {
    return this.userEntity.save(userData);
  }

  async findOne(
    findOptions: FindOptionsWhere<UserEntity>[],
  ): Promise<User | undefined> {
    return this.userEntity.find({
      where: findOptions,
    });
  }
}
