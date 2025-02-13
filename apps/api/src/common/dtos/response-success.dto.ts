import { ApiProperty } from "@nestjs/swagger";
import { BaseResponse } from "common/responses/base.response";

export class ResponseSuccessDto<D, M = unknown> extends BaseResponse {
  @ApiProperty({
    description: 'Response status',
    example: "success" 
  })
  status: string;

  data!: D;
    
  message!: string;
  
  meta?: M;

  constructor(params: { 
    status: string, 
    data: D, 
    message: string, 
    meta?: M
  }) {
  super(params.status);
  this.data = params.data;
  this.message = params.message;
  this.meta = params.meta;
  this.status = params.status;
  this.timestamp = new Date();
  }
}
  