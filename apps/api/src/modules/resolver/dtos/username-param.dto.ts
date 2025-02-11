import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, Matches } from 'class-validator';

export class UsernameParamDto {
    @ApiProperty({
        description: 'Username to resolve',
        minLength: 6,
        maxLength: 30,
        example: 'web3user'
    })
    @IsString()
    @Length(6, 30)
    @Matches(/^[a-zA-Z0-9_-]+$/, {
        message: 'Username can only contain letters, numbers, underscores, and hyphens'
    })
    username!: string;
}

