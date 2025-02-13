import { ClassConstructor, plainToClass } from "class-transformer";
import { ResponseSuccessPaginated } from "../responses/pagination.response";
import { ResponseSuccessDto } from "common/dtos/response-success.dto";
import { ResponsePaginatedMetaDto } from "common/dtos/response-paginated-meta-dto";
import { ResponseErrorDto } from "common/dtos/response-error.dto";
import { ErrorDto } from "common/dtos/error-dto";

export class ResponseTransformer {
    static success<T>(message: string, data: T): ResponseSuccessDto<T, undefined> {
      return new ResponseSuccessDto<T, undefined>({
        status: 'success',
        data,
        message,
      }); 
    }

    static successWithMeta<T, M>(message: string, data: T, meta: M): ResponseSuccessDto<T, M> {
      return new ResponseSuccessDto<T, M>({
        status: 'success',
        data,
        meta,
        message,
      });
    }
  
    static successPaginated<T>(
      data: T[],
      meta: ResponsePaginatedMetaDto, 
      message = 'Data retrieved successfully'
    ): ResponseSuccessPaginated<T> {
      return new ResponseSuccessPaginated<T>({
        status: "success", 
        message, 
        meta,
        data
      }); 
    }
  
    static error<D>(
      error: ErrorDto<D>,
      details?: D
    ): ResponseErrorDto<D> {
      return new ResponseErrorDto<D>({
        status: "error",
        error: {
          ...error,
          details  
        } 
      });
    }
  
    static transform<T, V>(data: T, dto: ClassConstructor<V>): V {
      return plainToClass(dto, data, { excludeExtraneousValues: true });
    }
  }