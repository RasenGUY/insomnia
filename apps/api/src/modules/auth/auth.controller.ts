import { 
  Controller, 
  Post, 
  Body, 
  HttpCode, 
  HttpStatus,
  Session,
  UnauthorizedException,
  Get,
  UseGuards,
  ValidationPipe,
  Logger
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './services/auth.service';
import { VerifySiweDto } from './dto/verify-siwe.dto';
import { ResponseTransformer } from 'common/transformers/response.transformer';
import { HandleHttpExceptions } from 'common/decorators/http-exceptions.decorator';
import { SiweError, SiweErrorType, SiweMessage } from 'siwe';
import { AuthGuard } from './auth.gaurd';
import { RegistrationDto } from './dto/registration.dto';
import { RegistrationService } from './services/registration.service';
import { NonceResponseDto } from './dto/nonce-response.dto';
import { CommonErrorResponsAPiProps } from 'common/responses/common-errors-api.response';
import { VerifyResponseDto } from './dto/verify-response.dto';
import { RegistrationResponseDto } from './dto/registration-response.dto';
import { CommonSuccessResponsApiProps } from 'common/responses/common-success-api.response';
import { SessionResponseDto } from './dto/session-response.dto';
import { SiweDto } from './dto/siwe-dto';
import { LogoutResponseDto } from './dto/logout-response.dto';
import { Address } from 'viem';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    private readonly logger = new Logger(AuthController.name);
    constructor(
        private readonly authService: AuthService,
        private readonly registrationService: RegistrationService
    ) {}

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @HandleHttpExceptions()
  @ApiOperation({ 
    summary: 'Verify SIWE message and signature',
    description: 'Verifies a Sign-In with Ethereum message and signature to authenticate users'
  })
  @ApiResponse(CommonSuccessResponsApiProps.OK(VerifyResponseDto))
  @ApiResponse(CommonErrorResponsAPiProps.BadRequest)
  @ApiResponse(CommonErrorResponsAPiProps.Unauthorized)
  @ApiResponse(CommonErrorResponsAPiProps.InternalServerError)
  async verify(
      @Body(ValidationPipe) dto: VerifySiweDto,
      @Session() session: Record<string, any>,
  ) {
    this.logger.debug({
      message: 'verify',
      dto: JSON.stringify(dto),
      session
    })
    const storedNonce = session.nonce;
    if (!storedNonce) {
      throw new UnauthorizedException('No nonce found in session');
    }

    try {
      const verifiedMessage = await this.authService.verifySiweMessage(
        dto.message,
        dto.signature,
        storedNonce
      );

      session.siwe = verifiedMessage;
      session.nonce = null;

      this.logger.log({
        message: 'verify',
        verifiedMessage,
        signature: dto.signature, 
      });

      return ResponseTransformer.success('Siwe verification success', {
        address: verifiedMessage.address,
        chainId: verifiedMessage.chainId,
        domain: verifiedMessage.domain,
        issuedAt: verifiedMessage.issuedAt,
      });

    } catch (error: any) {
      session.siwe = null;
      session.nonce = null;            
      if (error instanceof SiweError) {
        switch (error.type) {
          case SiweErrorType.EXPIRED_MESSAGE:
            throw new UnauthorizedException('Message has expired');
          case SiweErrorType.INVALID_SIGNATURE:
            throw new UnauthorizedException('Invalid signature');
          case SiweErrorType.INVALID_NONCE:
            throw new UnauthorizedException('Invalid nonce');
          case SiweErrorType.INVALID_ADDRESS:
            throw new UnauthorizedException('Invalid Ethereum address');
          case SiweErrorType.INVALID_DOMAIN:
            throw new UnauthorizedException('Invalid domain');
          case SiweErrorType.INVALID_URI:
            throw new UnauthorizedException('Invalid URI format');
          case SiweErrorType.UNABLE_TO_PARSE:
            throw new UnauthorizedException('Unable to parse message');
          default:
            throw new UnauthorizedException(error.type || 'Verification failed');
        }
      }
      throw error;
    }
  }

  @Get('nonce')
  @HandleHttpExceptions()
  @ApiOperation({ 
    summary: 'Get SIWE nonce for authentication',
    description: 'Generates a new nonce to be used in Sign-In with Ethereum message'
  })
  @ApiResponse({ 
    status: HttpStatus.OK,
    description: 'Nonce successfully generated',
    type: NonceResponseDto
  })
  @ApiResponse(CommonErrorResponsAPiProps.InternalServerError)
  async getNonce(@Session() session: Record<string, any>) {
    const nonce = await this.authService.generateNonce();
    session.nonce = nonce;
    this.logger.log({ 
      message: 'getNonce',
      nonce,
      session 
    });
    return ResponseTransformer.success('Nonce generated successfully', { nonce });
  }


  @Post('register')
  @HandleHttpExceptions()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Register a new user profile with wallet' })
  @ApiResponse(CommonSuccessResponsApiProps.Created(RegistrationResponseDto))
  @ApiResponse(CommonErrorResponsAPiProps.BadRequest)
  @ApiResponse(CommonErrorResponsAPiProps.Conflict)
  @ApiResponse(CommonErrorResponsAPiProps.Unauthorized)
  async register(
      @Body(ValidationPipe) dto: RegistrationDto,
      @Session() session: Record<string, any>
  ) {
      if (session.siwe?.address.toLowerCase() !== dto.address.toLowerCase()) {
        throw new UnauthorizedException('Wallet address does not match authenticated user');
      }

      const profile = await this.registrationService.registerWallet(dto);
      return ResponseTransformer.success('Profile created successfully', profile); 
  }

  @Get('session')
  @UseGuards(AuthGuard)
  @HandleHttpExceptions()
  @ApiOperation({ summary: 'Retrieves session data with a cookie.sid' })
  @ApiResponse(CommonSuccessResponsApiProps.OK(SessionResponseDto))
  @ApiResponse(CommonErrorResponsAPiProps.Unauthorized)
  async getSession(
      @Session() session: Record<string, any>
  ) {
    if (!session.siwe) {
      throw new UnauthorizedException();
    }
    const siwDto = new SiweDto();
    siwDto.domain = session.siwe.domain as string;
    siwDto.address = session.siwe.address as Address;
    siwDto.chainId = session.siwe.chainId as number;
    siwDto.issuedAt = session.siwe.issuedAt as string;

    this.logger.log({
      message: 'getSession',
      sessionSiwe: session.siwe as SiweMessage,
      siwDto
    })
    session.nonce = session.nonce;
    return ResponseTransformer.success('Session retrieved successfully', siwDto);
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  @HandleHttpExceptions()
  @ApiOperation({ summary: 'Deletes session data with a cookie.sid' })
  @ApiResponse(CommonSuccessResponsApiProps.OK(LogoutResponseDto))
  @ApiResponse(CommonErrorResponsAPiProps.Unauthorized)
  async logout(
      @Session() session: Record<string, any>
  ) {
    if (!session.siwe) {
      throw new UnauthorizedException('No session found');
    }
    session.siwe = null;
    session.nonce = null;

    this.logger.log({
      message: 'logout',
      session: null
    })
    return ResponseTransformer.success('Logged out successfully', null);
  }
}