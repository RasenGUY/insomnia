import { ApiProperty } from "@nestjs/swagger";

export class BaseResponse<T> {
    @ApiProperty({ example: true })
    success: boolean;
  
    @ApiProperty({ example: 'Something Happened' })
    message?: string;
  
    @ApiProperty()
    data?: T;
  
    @ApiProperty({
      description: 'Response timestamp',
      example: '2025-02-09T20:14:33.145Z'
    })
    timestamp: Date;
  
    constructor(success: boolean, data?: T, message?: string) {
      this.success = success;
      this.message = message;
      this.data = data;
      this.timestamp = new Date();
    }
  }
  