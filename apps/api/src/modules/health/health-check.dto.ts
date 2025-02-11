import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class HealthCheckDto  {
    @ApiProperty({
        description: 'Database connection status',
        example: true
    })
    @Expose()
    databaseConnection!: boolean;
}