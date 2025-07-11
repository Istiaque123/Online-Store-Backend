import {HttpException, Inject, Injectable} from '@nestjs/common';
import {UsersQuery} from "./users.query";
import {CreateUserDto, UpdateUserDto} from "./dto";
import {ResponsePromiseTypes, ResponseTypes} from "../../common/filters";

@Injectable()
export class UsersService {
    constructor(@Inject(UsersQuery) private readonly usersQuery: UsersQuery) {
    }

    async createUser(createUserDto: CreateUserDto): Promise<ResponsePromiseTypes> {

        try {
            return  await this.usersQuery.createUser(createUserDto);
        }
        catch (error) {
            console.log(error);
            throw new HttpException(ResponseTypes.FAILED(null, error.message), error.status);
        }
    }

    async updateUser(user_id: string, updateUserDto: UpdateUserDto): Promise<ResponsePromiseTypes> {
        try {
            return await this.usersQuery.updateUser(user_id, updateUserDto);
        }
        catch (error) {
            console.log(error);
            throw new HttpException(ResponseTypes.FAILED(null, error.message), error.status);
        }
    }

    async removeUser(user_id: string): Promise<ResponsePromiseTypes> {
        try {
            return await this.usersQuery.removeUser(user_id);
        }catch (e) {
            console.log(e);
            throw new HttpException(ResponseTypes.FAILED(null, e.message), e.status);
        }
    }

    async deleteUser(user_id: string): Promise<ResponsePromiseTypes> {
        try {
            return await this.usersQuery.deleteUser(user_id);
        }catch (e) {
            console.log(e);
            throw new HttpException(ResponseTypes.FAILED(null, e.message), e.status);
        }
    }

    async getAllUsers(): Promise<ResponsePromiseTypes> {
        try {
            return await this.usersQuery.getAllUsers();
        }catch (e) {
            console.log(e);
            throw new HttpException(ResponseTypes.FAILED(null, e.message), e.status);
        }
    }

    async getUserById(user_id:string): Promise<ResponsePromiseTypes>{
        try {
            return await this.usersQuery.getUserById(user_id);
        }catch (error){
            console.log(error);
            throw new HttpException(ResponseTypes.FAILED(null, error.message), error.status);
        }
    }
}
