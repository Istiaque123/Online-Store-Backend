import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {AuthUser} from "./authUser.entity";

@Entity()
export class LoginInfoEntity{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    token:string;

    @ManyToMany(
        () => AuthUser, {
            onDelete: 'CASCADE'
        })
    @JoinColumn({
        name: 'user_id',
    })
    user: AuthUser;

    @Column()
    user_id:string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn({ nullable: true ,
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