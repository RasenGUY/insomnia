import { ApiProperty } from "@nestjs/swagger";
import { ResponsePaginatedMetaDto } from "common/dtos/response-paginated-meta-dto";
import { ResponseSuccessDto } from "common/dtos/response-success.dto";

export class ResponseSuccessPaginated<T> extends ResponseSuccessDto<T[]> {
  
  @ApiProperty({
    description: 'Paginated response',
    type: 'array',
  })
  data!: T[];

  constructor(params: { 
    status: string, 
    data: T[],
    message: string, 
    meta?: ResponsePaginatedMetaDto
  }) {
    super({
      status: params.status,
      message: params.message,
      data: params.data,
    });
    this.meta = params.meta;
  }
}