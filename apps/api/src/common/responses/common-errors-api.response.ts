import { HttpStatus } from "@nestjs/common";
import { ErrorResponseDto } from "../dtos/error-response.dto";

export class CommonErrorResponsAPiProps {
    static readonly NotFound = {
        status: HttpStatus.NOT_FOUND,
        description: 'Resource not found',
        type: ErrorResponseDto
    };

    static readonly BadRequest = {
        status: HttpStatus.BAD_REQUEST,
        description: 'Bad request',
        type: ErrorResponseDto
    };

    static readonly Unauthorized = {
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized',
        type: ErrorResponseDto
    };

    static readonly Forbidden = {
        status: HttpStatus.FORBIDDEN,
        description: 'Forbidden',
        type: ErrorResponseDto
    };
    
    static readonly Conflict = {
        status: HttpStatus.CONFLICT,
        description: 'Conflict with existing resource',
        type: ErrorResponseDto
    };

    static readonly InternalServerError = {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Internal server error',
        type: ErrorResponseDto
    };
    static readonly ServiceUnavailable = {
        status: HttpStatus.SERVICE_UNAVAILABLE,
        description: 'Service Unavailable',
        type: ErrorResponseDto
    };
}