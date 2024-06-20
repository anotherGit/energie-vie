import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePriceDto {
  @ApiProperty({
    description: 'The price value, with up to two decimal places',
    example: 19.99,
    type: Number,
    format: 'decimal',
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  value: number;
}
