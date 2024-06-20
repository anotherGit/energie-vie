import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsUUID,
  IsInt,
  Min,
  Max,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateRatingDto {
  @ApiProperty({
    description: 'Rating value, must be between 1 and 10',
    example: 8,
    minimum: 1,
    maximum: 10,
  })
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  @Max(10)
  value: number;

  @ApiPropertyOptional({
    description:
      'Optional comment about the rating, maximum length is 4000 characters',
    example: 'This wine has an excellent taste!',
    maxLength: 4000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(4000)
  comment?: string;

  @ApiProperty({
    description: 'UUID of the wine bottle being rated',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  wineBottleId: string;
}
