import {Module} from "@nestjs/common";
import { RegistrationService } from "./services/registration.service";
import { ProfileService } from "../profile/profile.service";
import { WalletService } from "../wallet/wallet.service";
import { AuthController } from "./auth.controller";
import { AuthService } from "./services/auth.service";

@Module({
    providers: [
        RegistrationService,
        ProfileService,
        WalletService,
        AuthService
    ],
    controllers: [AuthController],
    exports: [
        RegistrationService,
        AuthService
    ]
  })
  export class AuthModule {}