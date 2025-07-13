import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('otp_codes')
export class OtpEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    identifier: string;

    @Column()
    otp: string;

    @Column({ default: false })
    isVerified: boolean;

    @CreateDateColumn()
    createdAt: Date;
}