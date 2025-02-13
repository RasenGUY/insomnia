import { ApiProperty } from "@nestjs/swagger";

export class BaseResponse {
  @ApiProperty({
    description: 'Response status',
    example: "success" 
  })
  status: string;
  
  @ApiProperty({
    description: 'Response timestamp',
    example: '2025-02-09T20:14:33.145Z'
  })
  timestamp: Date;

  constructor(status: string) {
    this.status = status;
    this.timestamp = new Date();
  }
}
  