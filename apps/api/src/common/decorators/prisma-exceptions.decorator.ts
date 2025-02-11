import { applyDecorators, UseFilters } from '@nestjs/common';
import { PrismaExceptionFilter } from '../filters/prisma-exception.filter';

export function HandlePrismaExceptions() {
  return applyDecorators(
    UseFilters(new PrismaExceptionFilter())
  );
}
