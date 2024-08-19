import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "../users/users.entity";

@Entity({ name: "otp" })
export class OtpEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false })
  otp: number;

  @Column({ type: "timestamp", nullable: false })
  expire_time: Date;

  @ManyToOne(() => UserEntity, (user) => user.otps)
  user: UserEntity;
}
