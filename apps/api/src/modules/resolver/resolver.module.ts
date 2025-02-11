import { Module } from "@nestjs/common";
import { ResolverController } from "./resolver.controller";
import { ResolverService } from "./resolver.service";
import { ProfileService } from "../profile/profile.service";
import { WalletService } from "../wallet/wallet.service";

@Module({
    providers: [
        ResolverService,
        ProfileService,
        WalletService
    ],
    controllers: [
        ResolverController
    ],
    exports: [ResolverService]
})
export class ResolverModule {}