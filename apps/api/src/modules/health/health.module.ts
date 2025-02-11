import { Module } from "@nestjs/common";
import { HealthService } from "./health.service";
import { HealthController } from "./health.controller";
@Module({
    providers: [
        HealthService,
    ],
    controllers: [
        HealthController
    ],
    exports: [HealthService]
})
export class HealthModule {}