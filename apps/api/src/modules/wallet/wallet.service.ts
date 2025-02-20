import { Injectable } from "@nestjs/common";
import { WalletLabel } from "@prisma/client";
import { PrismaService } from "nestjs-prisma";
import { WalletDto } from "./wallet.dto";
import { ModelTransformer } from "common/transformers/model.transferformer";
import { HandlePrismaExceptions } from "common/decorators/prisma-exceptions.decorator";
import { getAddress } from "viem";

@Injectable()
export class WalletService {
  constructor(private readonly prisma: PrismaService) {}

  @HandlePrismaExceptions() 
  async createWallet(
    data: {
      address: string;
      profileId: string;
      label?: WalletLabel;
    },
  ) {
    const walletCount = await this.prisma.wallet.count({
      where: { profileId: data.profileId }
    });
    const wallet = this.prisma.wallet.create({
      data: {
        address: getAddress(data.address), // store checksummed address
        profileId: data.profileId,
        isDefault: walletCount === 0,
        label: data.label ?? WalletLabel.POLYGON
      }
    });
    return ModelTransformer.toDto(wallet, WalletDto);  
  }
}

