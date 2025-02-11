import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Matches } from 'class-validator';
import { SiweMessage } from 'siwe';

/**
 * DTO for SIWE message verification
 * Validates and documents the required parameters for Sign-In with Ethereum verification
 */
export class VerifySiweDto {
  @ApiProperty({
    description: 'The prepared SIWE message string',
    example: 'example.com wants you to sign in with your Ethereum account:\n' +
             '0x742d35Cc6634C0532925a3b844Bc454e4438f44e\n\n' + 
             'Sign in with Ethereum to the app.\n\n' +
             'URI: https://example.com\n' +
             'Version: 1\n' +
             'Chain ID: 1\n' +
             'Nonce: jh3g4jh23g4jh23g4\n' +
             'Issued At: 2024-02-09T12:00:00.000Z'
  })
  @IsString()
  @IsNotEmpty()
  message!: string;

  @ApiProperty({
    description: 'The Ethereum signature of the SIWE message',
    example: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1b'
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^0x[a-fA-F0-9]{130}$/, {
    message: 'Invalid Ethereum signature format. Must be a 65-byte hexadecimal string starting with 0x'
  })
  signature!: string;

  /**
   * Validates and parses the SIWE message
   * @returns Parsed SiweMessage or throws error if invalid
   */
  parseSiweMessage(): SiweMessage {
    try {
      return new SiweMessage(this.message);
    } catch (error) {
      throw new Error('Invalid SIWE message format');
    }
  }
}