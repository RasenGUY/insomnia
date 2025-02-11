import { BaseResponse } from "common/responses/base.response";
import { ApiProperty } from "@nestjs/swagger";
import { ProfileDto } from "modules/profile/profile.dto";

export class RegistrationResponseDto implements Omit<BaseResponse<ProfileDto>, 'message'> {
    @ApiProperty({
        description: 'Response success status',
        example: true
    })
    success!: boolean;

    @ApiProperty({
        description: 'Response data containing verification details',
        type: ProfileDto
    })
    data!: ProfileDto;

    @ApiProperty({
        description: 'Response timestamp',
        example: '2025-02-09T20:14:33.145Z'
    })
    timestamp!: Date;
}