import {Body, Controller, Get, HttpCode, HttpStatus, Inject, Param, Post, UseGuards, UsePipes} from '@nestjs/common';
import {UsersService} from "./users.service";
import {JwtAuthGuard, RoleGuard} from "../../core/guards";
import {CreateUserDto, UpdateUserDto} from "./dto";
import {ResponsePromiseTypes} from "../../common/filters";
import {Roles} from "../../core/decorators";
import {ROLE} from "../../common/enums";
import {JoiValidationPipe} from "../../core/pipes";
import {CreateUserSchema, UpdateUserSchema} from "./schema";

@Controller('users')
@UseGuards(JwtAuthGuard, RoleGuard)
export class UsersController {
    constructor(@Inject(UsersService) private readonly usersService: UsersService) {
    }


    @Post('create')
    @HttpCode(HttpStatus.CREATED)
    @Roles(ROLE.USER, ROLE.ADMIN)
    @UsePipes(new JoiValidationPipe(CreateUserSchema))
    async createUser(@Body() body: CreateUserDto,): Promise<ResponsePromiseTypes> {
        return await this.usersService.createUser(body);
    }


    @Post('update/:user_id')
    @HttpCode(HttpStatus.ACCEPTED)
    @Roles(ROLE.USER, ROLE.ADMIN)
    @UsePipes(new JoiValidationPipe(UpdateUserSchema))
    async updateUser(@Body() body: UpdateUserDto, @Param('user_id') user_id: string,): Promise<ResponsePromiseTypes>{
        return await this.usersService.updateUser(user_id,body);
    }

    @Get('delete/:user_id')
    @HttpCode(HttpStatus.OK)
    @Roles(ROLE.ADMIN)
    async deleteUser(@Param('user_id') user_id: string,): Promise<ResponsePromiseTypes>{
        return await this.usersService.deleteUser(user_id);
    }

    @Get('remove/:user_id')
    @HttpCode(HttpStatus.OK)
    @Roles(ROLE.ADMIN, ROLE.USER)
    async removeUser(@Param('user_id') user_id: string,): Promise<ResponsePromiseTypes>{
        return await this.usersService.removeUser(user_id);
    }

    @Get('getAll')
    @HttpCode(HttpStatus.FOUND)
    @Roles(ROLE.ADMIN, )
    async getAllUsers(): Promise<ResponsePromiseTypes>{
        return await this.usersService.getAllUsers();
    }

    @Get('getByUserID/:user_id')
    @HttpCode(HttpStatus.FOUND)
    @Roles(ROLE.ADMIN, )
    async getByUserId(@Param('user_id') user_id: string): Promise<ResponsePromiseTypes>{
        return await this.usersService.getUserById(user_id);
    }





}

