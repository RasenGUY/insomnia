import { ApiProperty } from '@nestjs/swagger';
import { SiweDto } from './siwe-dto';
import { ResponseSuccessDto } from 'common/dtos/response-success.dto';

export class VerifyResponseDto extends ResponseSuccessDto<SiweDto> {
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