import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OtpEntity } from "./otp.entity";
import { LessThan, MoreThan, Repository } from "typeorm";
import { UserEntity } from "src/users/users.entity";
import { Cron } from "@nestjs/schedule";
import { EmailService } from "src/email/email.service";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(OtpEntity)
    private readonly otpRepository: Repository<OtpEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly emailService: EmailService,
    private jwtService: JwtService,
  ) {}

  async generateOtp(email: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ["otps"],
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP
    const expireTime = new Date();
    expireTime.setMinutes(expireTime.getMinutes() + 5);

    if (user.otps.length > 0) {
      const userOtp = user.otps[0];
      await this.otpRepository.update(userOtp.id, {
        otp,
        expire_time: expireTime,
      });
    }

    await this.otpRepository.save({
      otp,
      expire_time: expireTime,
      user,
    });

    await this.emailService.sendMail(
      user.email,
      "Your OTP Code",
      `Your OTP code is ${otp}. It will expire in 5 minutes.`,
    );
  }

  @Cron("*/5 * * * * *")
  async deleteExpiredOtps() {
    const now = new Date();
    await this.otpRepository.delete({ expire_time: LessThan(now) });
  }

  async getChangePasswordToken(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const tempToken = this.jwtService.sign(
      { userId: user.id },
      { secret: process.env.JWT_SECRET },
    );
    return tempToken;
  }

  async validateUpdatePasswordToken(token: string) {
    return await this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    });
  }

  async validateOtp(email: string, otp: number): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ["otps"],
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const now = new Date();
    const isOtpValid = user.otps.find(
      (otpRow) => otpRow.expire_time > now && otpRow.otp === otp,
    );

    if (!isOtpValid) {
      return false;
    }

    return true;
  }
}
