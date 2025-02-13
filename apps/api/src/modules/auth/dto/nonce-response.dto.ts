import { ApiProperty } from "@nestjs/swagger";
import { NonceDto } from "./nonce-dto";
import { ResponseSuccessDto } from "common/dtos/response-success.dto";

export class NonceResponseDto extends ResponseSuccessDto<NonceDto> {
    @ApiProperty({
        description: 'Response data containing nonce',
        type: NonceDto
    })
    data!: NonceDto;
}
