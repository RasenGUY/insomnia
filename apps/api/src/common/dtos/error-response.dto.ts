import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from '../responses/base.response';

export class ErrorResponseDto implements Omit<BaseResponse<null>, 'data'> {
    @ApiProperty({
        description: 'Response success status',
        example: false
    })
    success!: boolean;

    @ApiProperty({
        description: 'Error message',
        example: 'Record not found'
    })
    message!: string;

    @ApiProperty({
        description: 'Response timestamp',
        example: '2025-02-09T20:14:33.145Z'
    })
    timestamp!: Date;
}
