import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HealthService } from './health.service';
import { CommonSuccessResponsApiProps } from 'common/responses/common-success-api.response';
import { HealthCheckResponseDto } from './health-check-response.dto';
import { CommonErrorResponsAPiProps } from 'common/responses/common-errors-api.response';
import { HandleHttpExceptions } from 'common/decorators/http-exceptions.decorator';
import { ResponseTransformer } from 'common/transformers/response.transformer';

@ApiTags('Health')
@Controller('health')
@HandleHttpExceptions()
export class HealthController {
  constructor(
    private readonly healthService: HealthService,
  ) {}
  
  @ApiOperation({ 
    summary: 'Check API health status', 
    description: 'Checks health of the api'
  })
  @ApiResponse(CommonSuccessResponsApiProps.OK(HealthCheckResponseDto))
  @ApiResponse(CommonErrorResponsAPiProps.ServiceUnavailable)
  @Get()
  async check() {
    const response = await this.healthService.checkDatabaseConnection();
    return ResponseTransformer.success('Health check success', response);
  }
}