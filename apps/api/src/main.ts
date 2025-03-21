// External
import { HttpAdapterHost, NestFactory } from '@nestjs/core'
import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { PrismaClientExceptionFilter } from 'nestjs-prisma'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'
import session from 'express-session'

// Local
import { AppModule } from './app.module'
import type { CorsConfig, SessionConfig, SwaggerConfig, LogConfig } from './config/config.interface'
import { env } from 'process'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    autoFlushLogs: true,
    // bufferLogs: true,\
  })

  // Winston Logger
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER))

  console.log({
    message: 'config',
    sessionConfig: app.get(ConfigService).get('session') as SessionConfig,
    corsConfig: app.get(ConfigService).get('cors') as CorsConfig,
    swaggerConfig: app.get(ConfigService).get('swagger') as SwaggerConfig,
    env: app.get(ConfigService).get('env'),
    log: app.get(ConfigService).get('log') as LogConfig,
  })
  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      exceptionFactory: (errors) => {
        // Extract the first error message from the validation errors
        const firstErrorMessage = errors.map(
          (error) => Object.values(error.constraints || {})[0]
        )[0]
        return new BadRequestException(firstErrorMessage)
      },
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true, 
      stopAtFirstError: true,
    })
  )

  // enable shutdown hook
  app.enableShutdownHooks()

  // Prisma Client Exception Filter for unhandled exceptions
  const { httpAdapter } = app.get(HttpAdapterHost)
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter))

  // Config
  const configService = app.get(ConfigService)
  const swaggerConfig = configService.get<SwaggerConfig>('swagger') as SwaggerConfig
  const corsConfig = configService.get<CorsConfig>('cors') as CorsConfig

  // Swagger Api
  if (swaggerConfig.enabled) {
    const options = new DocumentBuilder()
      .setTitle(swaggerConfig.title)
      .setDescription(swaggerConfig.description)
      .setVersion(swaggerConfig.version)
      .build()
    const document = SwaggerModule.createDocument(app, options)

    SwaggerModule.setup(swaggerConfig.path, app, document)
  }

  // Cors
  if (corsConfig.enabled) {
    app.enableCors({
      origin: 'http://localhost:3000',
      exposedHeaders: ['set-cookie'],
      credentials: true
    })
  }

  // Session
  const sessionConfig = app.get(ConfigService).get('session') as SessionConfig
  app.use(
    session({
      secret: sessionConfig.secret,
      resave: sessionConfig.resave,
      saveUninitialized: sessionConfig.saveUninitialized,
      cookie: { 
        secure: sessionConfig.cookie.secure,
        httpOnly: sessionConfig.cookie.httpOnly,
        maxAge: sessionConfig.cookie.maxAge,
        path: '/', 
      },
    }),
  );
  // Start
  const port = configService.get<number>('port') as number
  await app.listen(port)

  // Startup Logging
  const logger = new Logger()
  logger.log(
    `${configService.get<string>('name')} v${configService.get<string>(
      'version'
    )} ${configService.get<string>('env')} started on port: ${configService.get<number>('port')}`
  )
}

void bootstrap()
