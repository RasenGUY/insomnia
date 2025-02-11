import { HttpStatus } from "@nestjs/common";

export class CommonSuccessResponsApiProps {
    
    static readonly Created = <T>(dto: T) => ({
        status: HttpStatus.CREATED,
        description: 'Created Successfully',
        type: dto
    });

    static readonly OK = <T>(dto: T) => ({
        status: HttpStatus.OK,
        description: 'Success',
        type: dto
    });

    static readonly Accepted = <T>(dto: T) => ({
        status: HttpStatus.ACCEPTED,
        description: 'Request Accepted',
        type: dto
    });

    static readonly NoContent = {
        status: HttpStatus.NO_CONTENT,
        description: 'No Content',
        type: undefined
    };
}