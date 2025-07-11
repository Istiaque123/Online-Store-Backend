import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {AuthUser} from "../../auth/entities";

@Entity('users')
export class Users {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(
        (): typeof AuthUser => AuthUser, {
            onDelete: 'CASCADE'
        }
    )
    @JoinColumn({
        name: 'user_id',
    })
    user: AuthUser;

    @Column()
    user_id: string;

    @Column()
    name: string;

    @Column({
        unique: true,
    })
    email: string;

    @Column({
        unique: true,
    })
    phone: string;

    @Column()
    address: string;

    @Column()
    place: string;

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
    status: boolean;

    @Column({
        default: false,
    })
    isDeleted: boolean;

}