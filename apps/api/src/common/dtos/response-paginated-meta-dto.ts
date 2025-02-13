import { ApiProperty } from "@nestjs/swagger";

export class ResponsePaginatedMetaDto { 

  @ApiProperty({
    description: 'Page number',
    example: 10
  })
  page!: number;

  @ApiProperty({
    description: 'Page limit',
    example: 10
  })
  limit!: number;

  @ApiProperty({
    description: 'Total number of records',
    example: 100
  })
  total!: number;
}
  