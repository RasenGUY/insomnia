import { ApiProperty } from '@nestjs/swagger';
import { ResponseErrorDto } from './response-error.dto';

export class HTTPErrorDto extends ResponseErrorDto<undefined> {

  @ApiProperty({
    description: 'Error status',
    example: "error"
  })
  status!: string;
  
  @ApiProperty({
    description: 'Error status code',
    example: 400
  })
  code!: number;

  @ApiProperty({
    description: 'Error message',
    example: 'Internal server error'
  })
  message!: string; 

  details: undefined;  
}
