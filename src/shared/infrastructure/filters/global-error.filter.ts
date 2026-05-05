import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import type { Response } from 'express';
import { BadRequestError } from '../../application/errors/bad-request.error';
import { NotFoundError } from '../../application/errors/not-found.error';
import { UnauthorizedError } from '../../application/errors/unauthorized.error';

@Catch()
export class GlobalErrorFilter implements ExceptionFilter {
  catch(error: Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (error instanceof BadRequestError) {
      statusCode = HttpStatus.BAD_REQUEST;
      message = error.message;
    } else if (error instanceof UnauthorizedError) {
      statusCode = HttpStatus.UNAUTHORIZED;
      message = error.message;
    } else if (error instanceof NotFoundError) {
      statusCode = HttpStatus.NOT_FOUND;
      message = error.message;
    } else if (error instanceof HttpException) {
      statusCode = error.getStatus();
      const res = error.getResponse();
      if (typeof res === 'object' && res !== null && 'message' in res) {
        const msg = (res as { message: string | string[] }).message;
        message = Array.isArray(msg) ? msg.join(', ') : msg;
      } else {
        message = error.message;
      }
    } else {
      message = error.message || 'Internal server error';
    }

    response.status(statusCode).json({ success: false, message, statusCode });
  }
}
