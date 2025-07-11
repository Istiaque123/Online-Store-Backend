import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Users} from "./entities";
import {Repository} from "typeorm";
import {CreateUserDto, UpdateUserDto} from "./dto";
import {ResponsePromiseTypes, ResponseTypes} from "../../common/filters";

@Injectable()
export class UsersQuery {

    constructor(@InjectRepository(Users) private readonly usersRepository: Repository<Users>) {
    }

    async createUser(createUserDto: CreateUserDto): Promise<ResponsePromiseTypes> {
        let checkUser: Users | null = await this.usersRepository.findOne({
            where: {
                user_id: createUserDto.user_id,
                isDeleted: false
            }
        });
        if (checkUser) {
            throw new HttpException(ResponseTypes.FAILED(null, 'UserId exist'), HttpStatus.CONFLICT);
        }

        checkUser = await this.usersRepository.findOne({
            where: {
                email: createUserDto.email,
                isDeleted: false
            }
        });
        if (checkUser) {
            throw new HttpException(ResponseTypes.FAILED(null, 'Email exist'), HttpStatus.CONFLICT);
        }

        checkUser = await this.usersRepository.findOne({
            where: {
                phone: createUserDto.phone,
                isDeleted: false
            }
        });
        if (checkUser) {
            throw new HttpException(ResponseTypes.FAILED(null, 'Phone exist'), HttpStatus.CONFLICT);
        }

        const newUser: Users = this.usersRepository.create({
            ...createUserDto,
            updatedAt: null
        });


        const user: Users = await this.usersRepository.save(newUser);

        return ResponseTypes.SUCCESS(user, 'User created successfully');

    }

    async updateUser(user_id: string, updateUserDto: UpdateUserDto): Promise<ResponsePromiseTypes> {
        const user: Users | null = await this.usersRepository.findOne({
            where: {
                user_id: user_id,
                isDeleted: false
            }
        });
        if (!user) {
            throw new HttpException(ResponseTypes.FAILED(null, 'User not found'), HttpStatus.NOT_FOUND);
        }

        const updatedUser: Users = await this.usersRepository.save({
            ...user,
            ...updateUserDto,
            updatedAt: new Date()
        });

        return ResponseTypes.SUCCESS(updatedUser, 'User updated successfully');
    }

    async removeUser(user_id: string): Promise<ResponsePromiseTypes> {
        const user: Users | null = await this.usersRepository.findOne({
            where: {
                user_id,
                isDeleted: false
            }
        });
        if (!user) {
            throw new HttpException(ResponseTypes.FAILED(null, 'User not found'), HttpStatus.NOT_FOUND);
        }
        const userData: Users = await this.usersRepository.save({
            ...user,
            isDeleted: true,
            updatedAt: new Date()
        })

        if (!userData) {
            throw new HttpException(ResponseTypes.FAILED(null, 'Failed to remove user'), HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return ResponseTypes.SUCCESS(userData, 'User removed successfully');

    }

    async deleteUser(user_id: string): Promise<ResponsePromiseTypes> {
        const user: Users | null = await this.usersRepository.findOne({
            where: {
                user_id,
            }
        });
        if (!user) {
            throw new HttpException(ResponseTypes.FAILED(null, 'User not found'), HttpStatus.NOT_FOUND);
        }

        await this.usersRepository.delete({
            user_id,
        });

        return ResponseTypes.SUCCESS(null, 'User deleted successfully');
    }

    async getAllUsers(): Promise<ResponsePromiseTypes> {
        const users: Users[] = await this.usersRepository.find({
            where: {
                isDeleted: false
            }
        });

        if (!users) {
            throw new HttpException(ResponseTypes.FAILED(null, 'No users found'), HttpStatus.NOT_FOUND);
        }

        return ResponseTypes.SUCCESS(users, 'Users found successfully');
    }

    async getUserById(user_id: string): Promise<ResponsePromiseTypes> {
        const user: Users | null = await this.usersRepository.findOne({
            where: {
                user_id,
                isDeleted: false
            }
        });

        if (!user) {
            throw new HttpException(ResponseTypes.FAILED(null, 'User not found'), HttpStatus.NOT_FOUND);
        }

        return ResponseTypes.SUCCESS(user, 'User found successfully');

    }

}