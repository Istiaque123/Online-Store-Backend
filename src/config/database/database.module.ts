import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import * as process from "node:process";
import {config} from "dotenv";
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
            entities: [],
            synchronize: true,
            // logging: true,
        }),
    ],
    controllers: [],
    providers: [],
})
export class DatabaseModule {}

