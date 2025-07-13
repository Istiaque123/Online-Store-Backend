import { Module } from '@nestjs/common';
import { DatabaseModule } from './config/database';
import { AuthModule } from './module/auth';
import { UsersModule } from './module/users';
import { OtpModule } from './module/otp';

@Module({
  imports: [DatabaseModule, AuthModule, UsersModule, OtpModule, ],
  controllers: [],
  providers: [],
})
export class AppModule {}
