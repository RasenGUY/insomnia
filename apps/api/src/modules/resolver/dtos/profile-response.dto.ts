import { ApiProperty } from '@nestjs/swagger';
import { ResponseSuccessDto } from 'common/dtos/response-success.dto';
import { ProfileDto } from 'modules/profile/profile.dto';

export class ProfileResponseDto extends ResponseSuccessDto<ProfileDto | null> {
    @ApiProperty({
        description: 'Response success status',
        example: true
    })
    success!: boolean;

    @ApiProperty({
        description: 'Response data containing profile information',
        type: ProfileDto
    })
    data!: ProfileDto | null;

    @ApiProperty({
        description: 'Response timestamp',
        example: '2025-02-09T20:14:33.145Z'
    })
    timestamp!: Date;
}