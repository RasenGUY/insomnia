import { ProfileDto } from "modules/profile/profile.dto";
import { WalletDto } from "modules/wallet/wallet.dto";
import { Profile, Wallet } from "@prisma/client";
import { ClassConstructor, plainToInstance } from "class-transformer";

export class ModelTransformer {

  static toProfileDto(data: Profile) {
    return this.toDto<Profile, ProfileDto>(data, ProfileDto); 
  }

  static toWalletDto(data: Wallet) {
    return this.toDto<Wallet, WalletDto>(data, WalletDto); 
  }
  
  static toDto<T, V>(data: T, dto: ClassConstructor<V>): V {
    return plainToInstance(dto, data, { excludeExtraneousValues: true });
  }

  static toDtoList<T, V>(data: T[], dto: ClassConstructor<V>): V[] {
    return plainToInstance(dto, data, {
      excludeExtraneousValues: true,
    });
  }
}