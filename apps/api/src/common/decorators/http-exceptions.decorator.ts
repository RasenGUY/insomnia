import { applyDecorators, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../filters/http-exception.filter';

export function HandleHttpExceptions() {
  return applyDecorators(
    UseFilters(new HttpExceptionFilter())
  );
}