import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger
} from '@nestjs/common';
import { Response } from 'express';  
import { ResponseTransformer } from 'common/transformers/response.transformer';
  
  @Catch(HttpException)
  export class HttpExceptionFilter implements ExceptionFilter {
    
    private readonly logger = new Logger(HttpExceptionFilter.name);
  
    catch(exception: HttpException, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
  
      let message: string;
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && 'message' in exceptionResponse) {
        message = Array.isArray(exceptionResponse.message) 
          ? exceptionResponse.message[0] 
          : exceptionResponse.message;
      } else {
        message = 'Internal server error';
      }
  
      const error = {
        code: status,
        stack: exception.stack,
        message,
      }
      if (response) {
        response
          .status(status)
          .json(ResponseTransformer.error(error));
        
        throw error
      }
    }
  }