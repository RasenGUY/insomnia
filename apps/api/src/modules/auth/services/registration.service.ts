import { ProfileService } from "modules/profile/profile.service";
import { WalletService } from "modules/wallet/wallet.service";
import { Injectable } from "@nestjs/common";
import { WalletLabel } from "@prisma/client";
import { PrismaService } from "nestjs-prisma";
import { RegistrationDto } from "../dto/registration.dto";
import { HandlePrismaExceptions } from "common/decorators/prisma-exceptions.decorator";

@Injectable()
export class RegistrationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly profileService: ProfileService,
    private readonly walletService: WalletService,
  ) {}

  @HandlePrismaExceptions()
  async registerWallet(dto: RegistrationDto){
    return this.prisma.$transaction(async (tx) => {
      const profile = await this.profileService.createProfile(dto.username);
      const wallet = await this.walletService.createWallet(
        {
          address: dto.address,
          profileId: profile.id,
          label: WalletLabel.POLYGON
        },
      );
      profile.wallets = [wallet];
      return profile;
    });
  }
}