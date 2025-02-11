import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import config from 'config/config'
import { configValidator } from 'config/config.validator'
import { WinstonModule, utilities } from 'nest-winston'
import { join } from 'path'
import { Environment, LogConfig } from 'config/config.interface'
import { format } from 'date-fns'
import * as winston from 'winston'
import { Prisma } from '@prisma/client'
import { PrismaModule, loggingMiddleware } from 'nestjs-prisma'
import { AuthModule } from './modules/auth/auth.module'
import { ResolverModule } from './modules/resolver/resolver.module'
import { HealthModule } from './modules/health/health.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      validationSchema: configValidator,
    }),
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const name = configService.get<string>('name')
        const env = configService.get<Environment>('env')
        const logConfig = configService.get<LogConfig>('log') as LogConfig

        const timestamp = format(new Date(), 'yyyyMMdd_HHmmss')
        const logFilePath = join('logs', `${env}_${timestamp}.log`)

        const transports: winston.transport[] = [
          new winston.transports.Console({
            level: logConfig.level,
            format: winston.format.combine(
              winston.format.timestamp(),
              winston.format.ms(),
              env !== Environment.PRODUCTION
                ? utilities.format.nestLike(name, {
                    colors: true,
                    prettyPrint: true,
                  })
                : winston.format.json()
            ),
          }),
        ]

        logConfig.enableFile &&
          transports.push(
            new winston.transports.File({
              filename: logFilePath,
              level: logConfig.level,
              format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.ms(),
                winston.format.json()
              ),
            })
          )

        return {
          transports,
        }
      },
    }),
    PrismaModule.forRootAsync({
      isGlobal: true,
      useFactory: () => {
        return {
          middlewares: [loggingMiddleware()],
          explicitConnect: true,
          prismaOptions: {
            transactionOptions: {
              isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
              maxWait: 5000,
              timeout: 10000,
            },
          },
        }
      },
    }),
    AuthModule,
    ResolverModule,
    HealthModule
  ],
})
export class AppModule {}
