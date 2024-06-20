import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsInt,
  Min,
  Max,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateRatingDto {
  @ApiPropertyOptional({
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
}
