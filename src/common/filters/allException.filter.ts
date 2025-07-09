import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Response } from 'express';
import { ResponseTypes } from './response.types';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost): void {
        const cxt: HttpArgumentsHost = host.switchToHttp();
        const response = cxt.getResponse<Response>();

        const status = exception instanceof HttpException
            ? exception.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;

        const exceptionResponse = exception instanceof HttpException
            ? exception.getResponse()
            : null;

        // Use the full response object from HttpException if available
        const responseBody = typeof exceptionResponse === 'object' && exceptionResponse !== null
            ? exceptionResponse
            : ResponseTypes.FAILED(null, exception?.message || 'Internal server error');

        // Ensure the status is set and the response is sent
        response.status(status).json(responseBody);
    }
}