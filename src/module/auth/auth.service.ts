import {HttpException, Inject, Injectable} from '@nestjs/common';
import {AuthQuery} from "./auth.query";
import {LoginDto, RefreshTokenDto, RegisterDto} from "./dto";
import {ResponsePromiseTypes, ResponseTypes} from "../../common/filters";
import {AuthUser} from "./entities";

@Injectable()
export class AuthService {

    constructor(@Inject(AuthQuery) private readonly authQuery: AuthQuery) {
    }

    async register(registerDto: RegisterDto): Promise<ResponsePromiseTypes> {
        try {
            const userResponse: AuthUser = await this.authQuery.registerUser(registerDto);


            return ResponseTypes.SUCCESS(userResponse, 'User registered successfully');
        } catch (error) {
            console.log(error);
            throw new HttpException(ResponseTypes.FAILED(null, error.message), error.status)
        }
    }

    async login(loginDto: LoginDto): Promise<ResponsePromiseTypes> {
        try {

            return await this.authQuery.loginUser(loginDto);

        } catch (error) {
            console.log(error);
            throw new HttpException(ResponseTypes.FAILED(null, error.message), error.status)
        }
    }

    async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<ResponsePromiseTypes> {
        try {

            return await this.authQuery.refreshTokens(refreshTokenDto.refreshToken);

        } catch (error) {
            console.log(error);
            throw new HttpException(ResponseTypes.FAILED(null, error.message), error.status)
        }
    }

    async logout(user_id: string): Promise<ResponsePromiseTypes> {
        try {
            return await this.authQuery.logoutUser(user_id);
        } catch (error) {
            console.log(error);
            throw new HttpException(ResponseTypes.FAILED(null, error.message), error.status)
        }
    }


}
