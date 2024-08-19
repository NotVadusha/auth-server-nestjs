import { Inject, Injectable } from "@nestjs/common";
import { UserEntity } from "./users.entity";
import { FindOptionsWhere, Repository } from "typeorm";
import { CreateUserDto } from "./dto/createUser.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

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

  async update(
    criteria: FindOptionsWhere<UserEntity>,
    updateParams: QueryDeepPartialEntity<UserEntity>,
  ) {
    return this.userEntity.update(criteria, updateParams);
  }
}
