import { 
  ExceptionFilter, 
  Catch, 
  ArgumentsHost, 
  HttpStatus,
  Logger
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';
import { ResponseTransformer } from '../transformers/response.transformer';

export type PrismaErrorResponse = {
  code: number;
  message: string;
  error: string;
  details?: Record<string, any>;
}

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name);

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    
    const errorResponse = this.handlePrismaError(exception);
    
    this.logger.error({
      error: exception.message,
      code: exception.code,
      meta: exception.meta,
      target: exception.meta?.target,
    });
    
    const error = {
      code: errorResponse.code,
      message: errorResponse.message,
    }

    response
      .status(errorResponse.code)
      .json(ResponseTransformer.error(error, exception.meta));
  }

  private handlePrismaError(error: Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      // Unique constraint violations
      case 'P2002': { // Unique constraint violation
        const target = error.meta?.target as string[];
        const response = {
          code: HttpStatus.CONFLICT,
          message: `Unique constraint violation: ${target?.join(', ')}`,
          details: error.meta ?? undefined 
        }
        return response;
      }

      // Record not found
      case 'P2025':
      case 'P2021': {
        return {
          code: HttpStatus.NOT_FOUND,
          message: 'Record not found',
        };
      }

      // Foreign key constraint failures
      case 'P2003': {
        const target = error.meta?.field_name as string;
        return {
          code: HttpStatus.BAD_REQUEST,
          message: `Foreign key constraint failed on field: ${target}`,
        };
      }

      // Invalid data type
      case 'P2006': {
        return {
          code: HttpStatus.BAD_REQUEST,
          message: 'Invalid data provided',
        };
      }

      // Required field constraint violations
      case 'P2011': {
        return {
          code: HttpStatus.BAD_REQUEST,
          message: 'Required field constraint violation',
        };
      }

      // Default case for unhandled Prisma errors
      default:
        return {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Internal server error',
        };
    }
  }
}

