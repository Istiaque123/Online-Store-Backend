import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Inject,
    Param,
    Post, UseGuards,
    UsePipes,

} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {JoiValidationPipe} from "../../core/pipes";
import {LoginSchema, LogoutSchema, RefreshTokenSchema, RegisterSchema} from "./schema";
import {ResponsePromiseTypes,} from "../../common/filters";
import {JwtAuthGuard} from "../../core/guards";
import {LoginDto, RefreshTokenDto, RegisterDto} from "./dto";

@Controller('auth')
export class AuthController {
    constructor(@Inject(AuthService) private readonly authService: AuthService) {
    }

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    @UsePipes(new JoiValidationPipe(RegisterSchema))
    async register(@Body() body: RegisterDto,): Promise<ResponsePromiseTypes > {
        return await this.authService.register(body)
    }

    @Post('login')
    @HttpCode(HttpStatus.ACCEPTED)
    @UsePipes(new JoiValidationPipe(LoginSchema))
    async login(@Body() body: LoginDto,): Promise<ResponsePromiseTypes> {
        return this.authService.login(body)

    }

    @Post('refresh-token')
    @HttpCode(HttpStatus.OK)
    @UsePipes(new JoiValidationPipe(RefreshTokenSchema))
    async refreshToken(@Body() body: RefreshTokenDto,): Promise<ResponsePromiseTypes> {
        return this.authService.refreshToken(body)

    }


    @Get('logout/:id')
    @HttpCode(HttpStatus.OK)
    @UsePipes(new JoiValidationPipe(LogoutSchema))
    @UseGuards(JwtAuthGuard)
    async logout(@Param('id') user_id: string,): Promise<ResponsePromiseTypes> {
        return this.authService.logout(user_id)

    }
}
