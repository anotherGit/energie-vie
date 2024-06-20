import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  Max,
  Min,
} from 'class-validator';
import { WineType } from '../wine-type.enum';
import { WineSortBy } from '../wine-bottle-sort-by.enum';

export class SearchWineBottleDto {
  @ApiPropertyOptional({
    description: 'Optional list of wine types',
    type: String,
    example: 'rouge,blanc',
  })
  @IsOptional()
  @IsArray()
  @IsEnum(WineType, { each: true })
  @Transform(({ value }) => {
    return value.replace(/^\[|\]$/g, '').split(',');
  })
  types?: WineType[];

  @ApiPropertyOptional({
    description: 'Optional minimum year of the wine',
    example: 1990,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  min_year?: number;

  @ApiPropertyOptional({
    description: 'Optional maximum year of the wine',
    example: 2020,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  max_year?: number;

  @ApiPropertyOptional({
    description: 'Optional minimum average rating of the wine',
    example: 4.5,
    type: Number,
    format: 'decimal',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  min_averageRating?: number;

  @ApiPropertyOptional({
    description: 'Optional minimum price of the wine',
    example: 10.99,
    type: Number,
    format: 'decimal',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  min_price?: number;

  @ApiPropertyOptional({
    description: 'Optional maximum price of the wine',
    example: 99.99,
    type: Number,
    format: 'decimal',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  max_price?: number;

  @ApiPropertyOptional({
    description: 'Optional sorting criteria',
    example: WineSortBy.PRICE_ASC,
    enum: WineSortBy,
  })
  @IsOptional()
  @IsEnum(WineSortBy)
  sortBy?: WineSortBy;

  @ApiPropertyOptional({
    description: 'Optional page number for pagination',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    description: 'Optional limit of items per page for pagination',
    example: 10,
    minimum: 1,
    maximum: 50,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;
}
