import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsDate, IsUUID } from "class-validator";

export abstract class BaseModel {
  @ApiProperty({
    description: 'Unique identifier',
    format: 'uuid'
  })
  @IsUUID('4')
  @Expose()
  id!: string;

  @ApiProperty({
    description: 'Creation timestamp',
    type: Date
  })
  @IsDate()
  @Expose()
  createdAt!: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    type: Date
  })
  @IsDate()
  @Expose()
  updatedAt!: Date;
}