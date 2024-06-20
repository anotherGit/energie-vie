import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { WineSortBy } from '../wine-bottle-sort-by.enum';

export class SearchWineBottleByTextDto {
  @ApiPropertyOptional({
    description: 'Optional search query text',
    example: 'Chardonnay',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  q?: string;

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
