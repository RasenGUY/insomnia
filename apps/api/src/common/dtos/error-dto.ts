import { ApiProperty } from '@nestjs/swagger';

export class ErrorDto<T = undefined> {

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

  details?: T;
  
  constructor(params: { 
    code: number, 
    details: T, 
    message: string,
  }) {
    this.code = params.code;
    this.message = params.message;
    this.details = params.details;
  }
}
