import {Body, Controller, HttpCode, HttpStatus, Inject, Post, UseGuards, UsePipes,} from '@nestjs/common';
import {OtpService} from "./otp.service";
import {SentOtpDto, VerifyOtpDto} from "./dto";
import {ResponsePromiseTypes} from "../../common/filters";
import {RoleGuard} from "../../core/guards";
import {Roles} from "../../core/decorators";
import {ROLE} from "../../common/enums";
import {JoiValidationPipe} from "../../core/pipes";
import {SentOtpSchema, VerifyOtpSchema} from "./schemas";

@Controller('otp')
// @UseGuards(RoleGuard)
export class OtpController {

    constructor(@Inject(OtpService) private otpService: OtpService) {
    }

    @Post('send')
    @HttpCode(HttpStatus.CREATED)
    // @Roles(ROLE.USER, ROLE.ADMIN)
    @UsePipes(new JoiValidationPipe(SentOtpSchema))
    async sendOtp(@Body() body: SentOtpDto): Promise<ResponsePromiseTypes>{
        return await this.otpService.sendOtp(body);
    }


    @Post('verify')
    @HttpCode(HttpStatus.OK)
    // @Roles(ROLE.USER, ROLE.ADMIN)
    @UsePipes(new JoiValidationPipe(VerifyOtpSchema))
    async verify(@Body() body: VerifyOtpDto): Promise<ResponsePromiseTypes>{
        return await this.otpService.varifyOtp(body);
    }

}
