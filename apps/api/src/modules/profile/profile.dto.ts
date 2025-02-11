import { BaseModel } from "common/abstracts/base.model";
import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length, Matches, IsOptional } from "class-validator";
import { WalletDto } from "../wallet/wallet.dto";
import { Expose } from "class-transformer";

export class ProfileDto extends BaseModel {
    @ApiProperty({
      description: 'Username for the profile',
      minLength: 6,
      maxLength: 30,
      example: 'web3user'
    })
    @IsString()
    @Length(6, 30)
    @Matches(/^[a-zA-Z0-9_-]+$/, {
      message: 'Username can only contain letters, numbers, underscores, and hyphens'
    })
    @Expose()
    username!: string;
  
    @ApiProperty({
      description: 'Associated wallets',
      type: [WalletDto],
      required: false
    })
    @IsOptional()
    @Expose()
    wallets?: WalletDto[];
  }
  