import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from 'common/responses/base.response';
import { HealthCheckDto } from './health-check.dto';

export class HealthCheckResponseDto implements Omit<BaseResponse<HealthCheckDto>, 'message'> {
    @ApiProperty({
        description: 'Response success status',
        example: true
    })
    success!: boolean;

    @ApiProperty({
        description: 'Response data containing verification details',
        type: HealthCheckDto
    })
    data!: HealthCheckDto;

    @ApiProperty({
        description: 'Response timestamp',
        example: '2025-02-09T20:14:33.145Z'
    })
    timestamp!: Date;
}