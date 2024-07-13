import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OtpEntity } from "../otp/otp.entity";

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

  @Column({ nullable: false, length: 255 })
  password: string;

  @OneToMany(() => OtpEntity, (otp) => otp.user)
  otps: OtpEntity[];
}
