import { ClassConstructor, plainToClass } from "class-transformer";
import { BaseResponse } from "../responses/base.response";
import { PaginatedResponse } from "../responses/pagination.response";

export class ResponseTransformer {
    static success<T>(data: T): BaseResponse<T> {
      return new BaseResponse<T>(true, data);
    }
  
    static paginated<T>(
      data: T[],
      total: number,
      page: number,
      limit: number,
      message = 'Data retrieved successfully'
    ): PaginatedResponse<T[]> {
      return new PaginatedResponse<T[]>(true, message, data, total, page, limit);
    }
  
    static error(message: string): BaseResponse<null> {
      return new BaseResponse(false, null, message);
    }
  
    static transform<T, V>(data: T, dto: ClassConstructor<V>): V {
      return plainToClass(dto, data, { excludeExtraneousValues: true });
    }
  }