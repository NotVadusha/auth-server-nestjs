import { Column, DataSource, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "User" })
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true, nullable: false })
  username: string;

  @Column({ unique: true, nullable: false, length: 50 })
  email: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createAt: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updateAt: Date;

  @Column({ unique: true, nullable: false, length: 255 })
  password: string;
}

export const userProvider = [
  {
    provide: "USERS_ENTITY",
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(UserEntity),
    inject: ["DATA_SOURCE"],
  },
];
