import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {AuthUser} from "./entities";
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {LoginInfoEntity} from "./entities/loginInfo.entity";
import {AuthQuery} from "./auth.query";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            AuthUser,
            LoginInfoEntity
        ])
    ],
    controllers: [AuthController],
    providers: [AuthService, AuthQuery],
})
export class AuthModule {}
