import { Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";
import { ProfileDto } from "./profile.dto";
import { ModelTransformer } from "common/transformers/model.transferformer";
import { HandlePrismaExceptions } from "common/decorators/prisma-exceptions.decorator";

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}
  
  @HandlePrismaExceptions()
  async createProfile(username: string) {
    const newProfile = await this.prisma.profile.create({
      data: { username }
    });
    return ModelTransformer.toDto(newProfile, ProfileDto);
  }

  async findProfileByUsername(username: string){
    const profile = await this.prisma.profile.findUnique({
      where: { username },
      include: {
        wallets: true
      }
    })
    return ModelTransformer.toDto(profile, ProfileDto);
  }

  @HandlePrismaExceptions()
  async findProfileByWalletAddress(walletAddress: string) {
    const profile = await this.prisma.profile.findFirst({
      where: {
        wallets: {
          some: {
            address: walletAddress
          }
        }
      },
      include: {
        wallets: true
      }
    });
    return ModelTransformer.toDto(profile, ProfileDto);
  }
}
