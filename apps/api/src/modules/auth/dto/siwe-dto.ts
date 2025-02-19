import { ApiProperty } from "@nestjs/swagger";
import { Address } from "viem";

export class SiweDto {
    @ApiProperty({
        description: 'Ethereum address of the authenticated user',
        example: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
    })
    address!: Address;

    @ApiProperty({
        description: 'Chain ID of the network',
        example: 137
    })
    chainId!: number;

    @ApiProperty({
        description: 'Domain that requested the signature',
        example: 'example.com'
    })
    domain!: string;

    @ApiProperty({
        description: 'Timestamp when the message was issued',
        example: '2025-02-09T20:14:33.145Z'
    })
    issuedAt!: string;
}
