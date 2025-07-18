import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import {UsersQuery} from "./users.query";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Users} from "./entities";

@Module({
  imports: [
      TypeOrmModule.forFeature([
          Users,
      ]),
  ],
  providers: [UsersService, UsersQuery],
  controllers: [UsersController]
})
export class UsersModule {}
