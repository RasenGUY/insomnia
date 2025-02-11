import { ApiProperty } from "@nestjs/swagger";
import { BaseResponse } from "./base.response";

export class PaginatedResponse<T> extends BaseResponse<T> {
    @ApiProperty()
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  
    constructor(
      success: boolean,
      message: string,
      data: T,
      total: number,
      page: number,
      limit: number
    ) {
      super(success, data, message);
      this.pagination = {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    }
  }