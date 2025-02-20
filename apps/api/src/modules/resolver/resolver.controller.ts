import { 
    Controller,  
    Get,
    Param,
    ValidationPipe,
    Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ResolverService } from './resolver.service';
import { ResponseTransformer } from 'common/transformers/response.transformer';
import { HandlePrismaExceptions } from 'common/decorators/prisma-exceptions.decorator';
import { HandleHttpExceptions } from 'common/decorators/http-exceptions.decorator';
import { UsernameParamDto } from './dtos/username-param.dto';
import { WalletAddressParamDto } from './dtos/wallet-address-param.dto';
import { ProfileResponseDto } from './dtos/profile-response.dto';
import { CommonErrorResponsAPiProps } from 'common/responses/common-errors-api.response';
import { CommonSuccessResponsApiProps } from 'common/responses/common-success-api.response';

@ApiTags('Resolver')
@Controller('resolve')
export class ResolverController {

    private readonly logger = new Logger(ResolverController.name);
    constructor(private readonly resolverService: ResolverService) {}

    @Get('/:username')
    @HandleHttpExceptions()
    @HandlePrismaExceptions()
    @ApiOperation({ 
        summary: 'Resolve username to profile',
        description: 'Retrieves a user profile by their username'
    })
    @ApiParam({
        name: 'username',
        description: 'Username to resolve',
        required: true,
        type: String
    })
    @ApiResponse(CommonSuccessResponsApiProps.OK(ProfileResponseDto))
    @ApiResponse(CommonErrorResponsAPiProps.BadRequest)
    async resolve(@Param(ValidationPipe) params: UsernameParamDto) {
        const profile = await this.resolverService.resolveUsername(params.username);
        this.logger.log({
            message: 'resolve',
            username: params.username,
        });
        return ResponseTransformer.success('Resolved successfully', profile);
    }
    
    @Get('reverse/:walletAddress')
    @HandleHttpExceptions()
    @HandlePrismaExceptions()
    @ApiOperation({ 
        summary: 'Resolve wallet address to profile',
        description: 'Retrieves a user profile by their wallet address'
    })
    @ApiParam({
        name: 'walletAddress',
        description: 'Ethereum wallet address to resolve',
        required: true,
        type: String
    })
    @ApiResponse(CommonSuccessResponsApiProps.OK(ProfileResponseDto))
    @ApiResponse(CommonErrorResponsAPiProps.BadRequest)
    async reverse(@Param(ValidationPipe) params: WalletAddressParamDto) {
        const profile = await this.resolverService.resolveWallet(params.walletAddress);
        this.logger.log({
            message: 'reverseResolve',
            walletAddress: params.walletAddress,
        });
        return ResponseTransformer.success('Reverse resolved successfully', profile);
    }
}