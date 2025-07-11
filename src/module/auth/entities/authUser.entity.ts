import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {ROLE} from "../../../common/enums";

@Entity('auth_users')
export class AuthUser {

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column({
       unique: true,
    })
    email:string;

    @Column()
    password:string;

    @Column({
        type: 'enum',
        enum: ROLE,
        default: ROLE.USER,
    })
    role:ROLE;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn({
        nullable: true,
        default: null
    })
    updatedAt: Date | null;

    @Column({
        default: true,
    })
    status:boolean;

    @Column({
        default: false,
    })
    isDeleted:boolean;
}