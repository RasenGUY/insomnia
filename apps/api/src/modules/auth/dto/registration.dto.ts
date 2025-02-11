import { IsString, Length, Matches, IsEthereumAddress } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Address } from 'viem';

export class RegistrationDto {
  @ApiProperty({
    description: 'Username for the new profile',
    minLength: 6,
    maxLength: 30
  })
  @IsString()
  @Length(6, 30)
  @Matches(/^[a-zA-Z0-9_-]+$/)
  username!: string;

  @ApiProperty({
    description: 'Ethereum wallet address',
    example: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
  })
  @IsEthereumAddress()
  address!: Address;
}