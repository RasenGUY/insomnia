import { HttpStatus } from "@nestjs/common";
import { ResponseErrorDto } from "../dtos/response-error.dto";


export class CommonErrorResponsAPiProps {
    static readonly NotFound = {
        status: HttpStatus.NOT_FOUND,
        description: 'Resource not found',
        type: ResponseErrorDto<undefined>
    };

    static readonly BadRequest = {
        status: HttpStatus.BAD_REQUEST,
        description: 'Bad request',
        type: ResponseErrorDto<undefined>
    };

    static readonly Unauthorized = {
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized',
        type: ResponseErrorDto<undefined>
    };

    static readonly Forbidden = {
        status: HttpStatus.FORBIDDEN,
        description: 'Forbidden',
        type: ResponseErrorDto<undefined>
    };
    
    static readonly Conflict = {
        status: HttpStatus.CONFLICT,
        description: 'Conflict with existing resource',
        type: ResponseErrorDto<undefined>
    };

    static readonly InternalServerError = {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Internal server error',
        type: ResponseErrorDto<undefined>
    };
    static readonly ServiceUnavailable = {
        status: HttpStatus.SERVICE_UNAVAILABLE,
        description: 'Service Unavailable',
        type: ResponseErrorDto<undefined>
    };
}