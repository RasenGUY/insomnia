import { Injectable } from '@nestjs/common';
import { ProfileService } from '../profile/profile.service';

@Injectable()
export class ResolverService {
    constructor(
        private readonly profileService: ProfileService,
    ) {}

    async resolveUsername(username: string) {
        const profile = await this.profileService.findProfileByUsername(username);
        return profile;
    }

    async resolveWallet(walletAddress: string) {
        const profile = await this.profileService.findProfileByWalletAddress(walletAddress);
        return profile;
    }
}
