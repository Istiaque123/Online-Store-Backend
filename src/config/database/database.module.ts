import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import * as process from "node:process";
import {config} from "dotenv";
import {AuthUser} from "../../module/auth/entities";
import {LoginInfoEntity} from "../../module/auth/entities/loginInfo.entity";
import {Users} from "../../module/users/entities";
import {OtpEntity} from "../../module/otp/entities";
config();

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: "postgres",
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            entities: [
                AuthUser,
                LoginInfoEntity,
                Users,
                OtpEntity
            ],
            synchronize: true,
            // logging: true,
        }),
    ],
    controllers: [],
    providers: [],
})
export class DatabaseModule {}

