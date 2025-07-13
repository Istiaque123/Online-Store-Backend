import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {OtpEntity} from "./entities";
import {Repository} from "typeorm";
import {SentOtpDto, VerifyOtpDto} from "./dto";
import {generateOTP} from "./utils";
import {OtpTypes} from "../../common/enums";

import * as nodemailer from 'nodemailer';
import axios from 'axios';

import {config} from "dotenv";
import * as process from "node:process";
import {ResponsePromiseTypes, ResponseTypes} from "../../common/filters";
config();


@Injectable()
export class OtpService {
    constructor(@InjectRepository(OtpEntity) private readonly otpRepository:  Repository<OtpEntity>) {
    }

    async sendOtp(sentOtpDto: SentOtpDto): Promise<ResponsePromiseTypes>{
        try {
            const otp: string = generateOTP();

            await this.otpRepository.save({
                ...sentOtpDto,
                otp,
            });

            if (sentOtpDto.type === OtpTypes.EMAIL){
                await this.sendOtpViaEmail(sentOtpDto.identifier, otp);
            } else {
                await this.sendOtpViaSms(sentOtpDto.identifier, otp);
            }

            return ResponseTypes.SUCCESS(otp, 'OTP sent successfully');
        }
        catch (error) {
            console.log(error);
            throw new HttpException(ResponseTypes.FAILED(null, error.message), error.status)
        }

    }

    async varifyOtp(varifyOtpDto: VerifyOtpDto): Promise<ResponsePromiseTypes>{
        const record: OtpEntity | null = await this.otpRepository.findOne({
            where : {
                ...varifyOtpDto,
                isVerified: false,
            },
            order : {
                createdAt: 'DESC'
            }
        });

        if (!record){
            throw new HttpException(ResponseTypes.FAILED(null, 'Invalid OTP'), HttpStatus.NOT_FOUND);
        }

        const createdAt: number = record.createdAt.getTime();

        const currentTime: number = new Date().getTime();
        const ttl: number = 1000 * 60 * 5;


        if (currentTime - createdAt > ttl){
            throw new HttpException(ResponseTypes.FAILED(null, 'OTP expired'), HttpStatus.NOT_ACCEPTABLE);
        }

        record.isVerified = true;
        await this.otpRepository.save(record);

        return ResponseTypes.SUCCESS(null, 'OTP verified successfully');

    }



    private async sendOtpViaEmail(email: string, otp: string): Promise<void>{

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: `"Isti Store" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Your OTP Code for Secure Access',
            text: `Your OTP code is ${otp}. Do not share this OTP with anyone. It will expire in 5 minutes.`,
            html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <!-- Header -->
            <div style="background-color: #1a73e8; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Your OTP Code</h1>
            </div>
            
            <!-- Body -->
            <div style="background-color: #ffffff; padding: 20px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <p style="font-size: 16px; color: #333333;">Hello,</p>
              <p style="font-size: 16px; color: #333333;">
                You have requested a one-time password (OTP) to securely access your account. Please use the code below to proceed:
              </p>
              
              <!-- OTP Display -->
              <div style="text-align: center; margin: 20px 0;">
                <span style="display: inline-block; background-color: #e8f0fe; color: #1a73e8; font-size: 24px; font-weight: bold; padding: 10px 20px; border-radius: 5px;">
                  ${otp}
                </span>
              </div>
              
              <p style="font-size: 16px; color: #333333;">
                This OTP is valid for <strong>5 minutes</strong>. For your security, do not share this code with anyone.
              </p>
              
              <p style="font-size: 16px; color: #333333;">
                If you did not request this OTP, please ignore this email or contact our support team immediately.
              </p>
              
              <!-- Call to Action -->
              <div style="text-align: center; margin: 20px 0;">
                <a href="https://your-app.com/support" style="background-color: #1a73e8; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">
                  Contact Support
                </a>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="text-align: center; padding: 20px; font-size: 14px; color: #666666;">
              <p>© ${new Date().getFullYear()} Your App Name. All rights reserved.</p>
              <p>
                Need help? <a href="mailto:support@your-app.com" style="color: #1a73e8; text-decoration: none;">support@your-app.com</a>
              </p>
            </div>
          </div>
        `,
        });
    }

    private async sendOtpViaSms(phone: string, otp: string): Promise<void>{
        await axios.post(`https://your-sms-provider.com/api`, {
            to: phone,
            message: `Your OTP is: ${otp}`,
            apiKey: process.env.SMS_API_KEY,
        });
    }
}
