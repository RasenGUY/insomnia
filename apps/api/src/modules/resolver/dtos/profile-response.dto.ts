import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from 'common/responses/base.response';
import { ProfileDto } from 'modules/profile/profile.dto';

export class ProfileResponseDto implements Omit<BaseResponse<ProfileDto>, 'message'> {
    @ApiProperty({
        description: 'Response success status',
        example: true
    })
    success!: boolean;

    @ApiProperty({
        description: 'Response data containing profile information',
        type: ProfileDto
    })
    data!: ProfileDto;

    @ApiProperty({
        description: 'Response timestamp',
        example: '2025-02-09T20:14:33.145Z'
    })
    timestamp!: Date;
}