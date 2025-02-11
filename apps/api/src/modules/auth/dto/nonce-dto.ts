import { ApiProperty } from "@nestjs/swagger";

export class NonceDto {
    @ApiProperty({
        description: 'Generated nonce for SIWE authentication',
        example: 'bK7nX9eM4pL2wQ8z'
    })
    nonce!: string;
}