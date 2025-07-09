import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Inject,
    Param,
    Post,
    Req,
    UseGuards,
    UsePipes,
    Res
} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {JoiValidationPipe} from "../../core/pipes";
import {LoginSchema, LogoutSchema, RefreshTokenSchema, RegisterSchema} from "./schema";
import {Request, Response} from "express";
import {ResponsePromiseTypes, ResponseTypes} from "../../common/filters";
import {JwtAuthGuard} from "../../core/guards";

@Controller('auth')
export class AuthController {
    constructor(@Inject(AuthService) private readonly authService: AuthService) {
    }


    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    @UsePipes(new JoiValidationPipe(RegisterSchema))
    async register(@Req() req: Request, @Res() res: Response): Promise<ResponsePromiseTypes | undefined> {
        try {
            const {body} = req;
            return this.authService.register(body)
        } catch (error) {
            console.log(error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(
                ResponseTypes.FAILED(null, error.message)
            );
        }
    }

    @Post('login')
    @HttpCode(HttpStatus.ACCEPTED)
    @UsePipes(new JoiValidationPipe(LoginSchema))
    async login(@Req() req: Request, @Res() res: Response): Promise<ResponsePromiseTypes | undefined> {
        try {
            const {body} = req;
            return this.authService.login(body)
        } catch (error) {
            console.log(error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(
                ResponseTypes.FAILED(null, error.message)
            );
        }
    }

    @Post('refresh-token')
    @HttpCode(HttpStatus.OK)
    @UsePipes(new JoiValidationPipe(RefreshTokenSchema))
    async refreshToken(@Req() req: Request, @Res() res: Response): Promise<ResponsePromiseTypes | undefined> {
        try {
            const {body} = req;
            return this.authService.refreshToken(body)
        } catch (error) {
            console.log(error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(
                ResponseTypes.FAILED(null, error.message)
            );
        }
    }


    @Get('logout/:id')
    @HttpCode(HttpStatus.OK)
    @UsePipes(new JoiValidationPipe(LogoutSchema))
    @UseGuards(JwtAuthGuard)
    async logout(@Param('id') user_id: string, @Res() res: Response): Promise<ResponsePromiseTypes | undefined> {

        try {
            return this.authService.logout(user_id)
        } catch (error) {
            console.log(error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(
                ResponseTypes.FAILED(null, error.message)
            );
        }
    }
}
