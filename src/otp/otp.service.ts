import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OtpEntity } from "./otp.entity";
import { LessThan, MoreThan, Repository } from "typeorm";
import { UserEntity } from "src/users/users.entity";
import { Cron } from "@nestjs/schedule";

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(OtpEntity)
    private readonly otpRepository: Repository<OtpEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async generateOtp(email: string): Promise<OtpEntity> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new Error("User not found");
    }

    const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP
    const expireTime = new Date();
    expireTime.setMinutes(expireTime.getMinutes() + 5);

    const otpFromDb = await this.otpRepository.findOne({ where: { user } });

    if (otpFromDb) {
      await this.otpRepository.update(otpFromDb.id, {
        otp,
        expire_time: expireTime,
      });
      return await this.otpRepository.findOne({ where: { id: otpFromDb.id } });
    }

    return await this.otpRepository.save({
      otp,
      expire_time: expireTime,
      user,
    });
  }

  @Cron("*/5 * * * * *")
  async deleteExpiredOtps() {
    const now = new Date();
    await this.otpRepository.delete({ expire_time: LessThan(now) });
  }

  async validateOtp(email: string, otp: number): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ["otps"],
    });
    if (!user) {
      throw new Error("User not found");
    }

    const now = new Date();
    const otpEntity = await this.otpRepository.findOne({
      where: {
        user,
        otp,
        expire_time: MoreThan(now),
      },
    });

    if (!otpEntity) {
      return false;
    }

    return true;
  }
}
