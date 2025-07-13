import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { OtpController } from './otp.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {OtpEntity} from "./entities";

@Module({
  imports: [
      TypeOrmModule.forFeature([
          OtpEntity
      ]),
  ],
  providers: [OtpService],
  controllers: [OtpController]
})
export class OtpModule {}
