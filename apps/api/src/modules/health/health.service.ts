import { ModelTransformer } from "common/transformers/model.transferformer";
import { Injectable, ServiceUnavailableException } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";
import { HealthCheckDto } from "./health-check.dto";

@Injectable()
export class HealthService {
    constructor(private readonly prisma: PrismaService) {}
    
    async checkDatabaseConnection() {
        try {
            await this.prisma.$queryRaw`SELECT 1`;
            return ModelTransformer.toDto<{ databaseConnection: boolean }, HealthCheckDto>({
                databaseConnection: true
            }, HealthCheckDto);
        } catch (error: any) {
            throw new ServiceUnavailableException('Database connection failed'); 
        }
    }
}
