import { BaseResponse } from "common/responses/base.response";
import { ApiProperty } from "@nestjs/swagger";
import { NonceDto } from "./nonce-dto";

export class NonceResponseDto implements Omit<BaseResponse<NonceDto>, 'message'> {
    @ApiProperty({
        description: 'Response success status',
        example: true
    })
    success!: boolean;

    @ApiProperty({
        description: 'Response data containing nonce',
        type: NonceDto
    })
    data!: NonceDto;

    @ApiProperty({
        description: 'Response timestamp',
        example: '2025-02-09T20:14:33.145Z'
    })
    timestamp!: Date;
}
