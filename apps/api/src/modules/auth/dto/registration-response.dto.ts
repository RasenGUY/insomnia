import { ApiProperty } from "@nestjs/swagger";
import { ProfileDto } from "modules/profile/profile.dto";
import { ResponseSuccessDto } from "common/dtos/response-success.dto";

export class RegistrationResponseDto extends ResponseSuccessDto<ProfileDto> {
    @ApiProperty({
        description: 'Response data containing verification details',
        type: ProfileDto
    })
    data!: ProfileDto;
}