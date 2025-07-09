import {CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {Observable} from "rxjs";
import {ResponseTypes} from "../../common/response";
import * as jwt from "jsonwebtoken";
import {config} from "dotenv";
import * as process from "node:process";
config();

@Injectable()
export class JwtAuthGuard implements CanActivate {

    canActivate(context: ExecutionContext):
        boolean | Promise<boolean> | Observable<boolean> {

        const req = context.switchToHttp().getRequest();

        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new HttpException(
                ResponseTypes.FAILED(null, 'Missing token'),
                HttpStatus.NOT_ACCEPTABLE
            );
        }

        const token:string = authHeader.split(' ')[1];

        if (!token){
            throw new HttpException(
                ResponseTypes.FAILED(null, 'Invalid token or missing token'),
                HttpStatus.NOT_ACCEPTABLE
            );
        }

        try {

            const secretToken: string | undefined = process.env.ACCESS_TOKEN_SECRET;
            req.user = jwt.verify(token, secretToken!);

            return true;

        }catch (error){
            console.log(error);
            throw new HttpException(
                ResponseTypes.FAILED(null, `Error verifying token: ${error.message}`),
                HttpStatus.NOT_ACCEPTABLE
            )
        }

    }


}