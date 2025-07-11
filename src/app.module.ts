import { Module } from '@nestjs/common';
import { DatabaseModule } from './config/database';
import { AuthModule } from './module/auth';
import { UsersModule } from './module/users';

@Module({
  imports: [DatabaseModule, AuthModule, UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
