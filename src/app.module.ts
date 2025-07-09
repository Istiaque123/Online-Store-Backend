import { Module } from '@nestjs/common';
import { DatabaseModule } from './config/database';
import { AuthModule } from './module/auth/auth.module';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
