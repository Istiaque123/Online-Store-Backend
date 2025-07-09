import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {AuthUser} from "./entities";
import {Repository} from "typeorm";
import {LoginDto, RegisterDto, TokenPayloadDto} from "./dto";
import {ResponsePromiseTypes, ResponseTypes} from "../../common/filters";
import {ROLE} from "../../common/enums";
import * as bcrypt from "bcrypt";
import * as process from "node:process";
import {config} from "dotenv";
config();
import * as jwt from "jsonwebtoken";
import {LoginInfoEntity} from "./entities/loginInfo.entity";

@Injectable()
export class AuthQuery {

    constructor(
        @InjectRepository(AuthUser) private readonly authUser: Repository<AuthUser>,
        @InjectRepository(LoginInfoEntity) private readonly loginInfoModel: Repository<LoginInfoEntity>
        ) {}

    async registerUser(registerDto: RegisterDto): Promise<AuthUser>{

        if (registerDto.password !== registerDto.confirmPassword){
            throw new HttpException(ResponseTypes.FAILED(null, 'Passwords do not match'),
                HttpStatus.NOT_ACCEPTABLE)
        }

        const checkUser: AuthUser| null = await this.authUser.findOne({
            where: {email: registerDto.email}
        });

        if (checkUser) {
            throw new HttpException(ResponseTypes.FAILED(null, 'Email already exists'),
            HttpStatus.CONFLICT);
        }

        if (!registerDto.role) {
            registerDto.role = ROLE.USER;
        }

        const salt: string = await bcrypt.genSalt(10);
        const hashedPassword: string = await bcrypt.hash(registerDto.password, salt);

        const newUser: AuthUser  =  this.authUser.create({
            email: registerDto.email,
            password: hashedPassword,
            role: registerDto.role,
        });

        if (!newUser) {
            throw new HttpException(ResponseTypes.FAILED(null, 'Failed to create user'),
                HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return this.authUser.save(newUser);
    }


    async loginUser(loginDto: LoginDto): Promise<ResponsePromiseTypes>{
        const checkUser: AuthUser | null = await this.authUser.findOne({
            where: {email: loginDto.email}
            }
        );

        if (!checkUser){
            throw new HttpException(ResponseTypes.FAILED(null, 'User not found'),
                HttpStatus.NOT_FOUND);
        }

        const checkPassword: boolean = await bcrypt.compare(loginDto.password, checkUser.password);

        if (!checkPassword){
            throw new HttpException(ResponseTypes.FAILED(null, 'Invalid password'),
                HttpStatus.UNAUTHORIZED);
        }

        const timeStamp = new Date();
        const tokenData = {
            userId: checkUser.id,
            role: checkUser.role,
            timeStamp,
        };
        const accessToken: string = this.generateAccessToken(tokenData);
        const refreshToken: string = this.generateRefreshToken(tokenData);

        const loginInfo: LoginInfoEntity = this.loginInfoModel.create({
            token: refreshToken,
            user_id: checkUser.id,
        });

        await this.loginInfoModel.save(loginInfo);


        return ResponseTypes.SUCCESS({
                accessToken,
                refreshToken
            },
            "Login successful");
    }

    async refreshTokens(refreshToken: string): Promise<ResponsePromiseTypes> {

        const findLoginInfo: LoginInfoEntity | null = await this.loginInfoModel.findOne({
            where: {
                token: refreshToken,
                isDeleted: false,
                status: true,
            }
        })

        if (!findLoginInfo) {
            throw new HttpException(ResponseTypes.FAILED(null, 'Invalid refresh token'),
                HttpStatus.NOT_ACCEPTABLE);
        }

        const decodeToken: TokenPayloadDto = await new Promise<TokenPayloadDto>((resolve, reject) => {
            const secret: string | undefined = process.env.REFRESH_TOKEN_SECRET;
            jwt.verify(refreshToken, secret!, (err, decoded: TokenPayloadDto) => {
                if (err) {
                    reject(err);
                }
                resolve(decoded);
            });
        });
        const timeStamp = new Date();
        const tokenPayload = {
            userId: decodeToken.userId,
            role: decodeToken.role,
            timeStamp
        };

        const accessToken: string = this.generateAccessToken(tokenPayload);

        return {
            data: {
                accessToken,
                refreshToken: refreshToken
            },
            message: "Token refresh successful",
            error: false
        }

    }


   async logoutUser(user_id: string): Promise<ResponsePromiseTypes> {

       const findLoginInfo: LoginInfoEntity | null = await this.loginInfoModel.findOne({
           where: {
               user_id: user_id,
               isDeleted: false,
               status: true,
           }
       })

       if (!findLoginInfo) {
           throw new HttpException(ResponseTypes.FAILED(null, 'Invalid refresh token'),
               HttpStatus.NOT_ACCEPTABLE);
       }

       await this.loginInfoModel.delete(findLoginInfo.id);

        return ResponseTypes.SUCCESS(null, "Logout successful");
    }

    private generateAccessToken(tokenData: object){
        const secret: string | undefined = process.env.ACCESS_TOKEN_SECRET;
        if (!secret) {
            throw new Error("ACCESS_TOKEN_SECRET is not defined in environment variables");
        }
        return jwt.sign(tokenData, secret, {expiresIn: "1h"});
    }

    private generateRefreshToken(tokenData: object): string {
        const secret: string | undefined = process.env.REFRESH_TOKEN_SECRET;
        if (!secret) {
            throw new Error("REFRESH_TOKEN_SECRET is not defined in environment variables");
        }
        return jwt.sign(tokenData, secret, {expiresIn: "1h"});
    }
}
