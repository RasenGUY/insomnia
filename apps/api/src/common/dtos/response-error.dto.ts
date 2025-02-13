import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from '../responses/base.response';
import { ErrorDto } from "./error-dto"; 

export class ResponseErrorDto<D> extends BaseResponse {
  @ApiProperty({
    description: 'Error status',
    example: "error"
  })
  status!: string;

  @ApiProperty({
    description: 'Error details',
    type: ErrorDto<D>,
  })
  error!: ErrorDto<D>;

  @ApiProperty({
    description: 'Response timestamp',
    example: '2025-02-09T20:14:33.145Z'
  })
  timestamp!: Date;
  
  constructor(params: { 
    status: string, 
    error: ErrorDto<D>, 
  }) {
    super(params.status);
    this.error = params.error;
    this.timestamp = new Date();
  }
}
