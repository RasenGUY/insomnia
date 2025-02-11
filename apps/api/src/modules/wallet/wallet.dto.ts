import { BaseModel } from "common/abstracts/base.model";
import { ApiProperty } from "@nestjs/swagger";
import { WalletLabel } from "@prisma/client";
import { Expose } from "class-transformer";
import { IsEthereumAddress, IsUUID, IsBoolean, IsEnum } from "class-validator";

export class WalletDto extends BaseModel {
    @ApiProperty({
      description: 'Ethereum wallet address',
      example: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
    })
    @IsEthereumAddress()
    @Expose()
    address!: string;
  
    @ApiProperty({
      description: 'Reference to the associated profile',
      format: 'uuid'
    })
    @IsUUID('4')
    @Expose()
    profileId!: string;
  
    @ApiProperty({
      description: 'Indicates if this is the default wallet for the profile',
      default: false
    })
    @IsBoolean()
    @Expose()
    isDefault!: boolean;
  
    @ApiProperty({
      description: 'Type of blockchain network',
      enum: WalletLabel,
      default: WalletLabel.POLYGON
    })
    @IsEnum(WalletLabel)
    @Expose()
    label!: WalletLabel;
  }
  