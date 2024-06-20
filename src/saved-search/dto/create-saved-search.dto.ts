import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { WineType } from '../../wine-bottle/wine-type.enum';

export class CreateSavedSearchDto {
  @ApiProperty({
    description: 'The name of the saved search',
    example: 'Favorite Red Wines',
    maxLength: 1000,
  })
  @IsString()
  @MaxLength(1000)
  searchName: string;

  @ApiPropertyOptional({
    description: 'Optional list of wine types',
    example: ['rouge', 'blanc'],
    enum: WineType,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(WineType, { each: true })
  types?: WineType[];

  @ApiPropertyOptional({
    description: 'Optional minimum year of the wine',
    example: 1990,
  })
  @IsOptional()
  @IsInt()
  min_year?: number;

  @ApiPropertyOptional({
    description: 'Optional maximum year of the wine',
    example: 2020,
  })
  @IsOptional()
  @IsInt()
  max_year?: number;

  @ApiPropertyOptional({
    description: 'Optional minimum average rating, must be between 1 and 10',
    example: 7,
    minimum: 1,
    maximum: 10,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  min_averageRating?: number;

  @ApiPropertyOptional({
    description: 'Optional minimum price of the wine',
    example: 10.99,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  min_price?: number;

  @ApiPropertyOptional({
    description: 'Optional maximum price of the wine',
    example: 99.99,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  max_price?: number;
}
