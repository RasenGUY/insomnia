import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from 'common/responses/base.response';
import { SiweDto } from './siwe-dto';

export class VerifyResponseDto implements Omit<BaseResponse<SiweDto>, 'message'> {
    @ApiProperty({
        description: 'Response success status',
        example: true
    })
    success!: boolean;

    @ApiProperty({
        description: 'Response data containing verification details',
        type: SiweDto
    })
    data!: SiweDto;

    @ApiProperty({
        description: 'Response timestamp',
        example: '2025-02-09T20:14:33.145Z'
    })
    timestamp!: Date;
}