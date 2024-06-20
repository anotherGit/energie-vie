import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { WineType } from '../wine-type.enum';
import { CreatePriceDto } from '../../price/dto/create-price.dto';
import { CreateGrapeVarietyDto } from '../../grape-variety/dto/create-grape-variety.dto';
import { Type } from 'class-transformer';

export class UpdateWineBottleDto {
  @ApiPropertyOptional({
    description: 'Name of the wine bottle',
    example: 'Chateau Margaux',
  })
  @IsOptional()
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Type of wine',
    example: 'rouge',
    enum: WineType,
  })
  @IsOptional()
  @IsEnum(WineType)
  type: WineType;

  @ApiPropertyOptional({
    description: 'Year the wine was produced',
    example: 2015,
  })
  @IsOptional()
  @IsInt()
  year: number;

  @ApiPropertyOptional({
    description: 'Price details of the wine',
    type: CreatePriceDto,
  })
  @IsOptional()
  price: CreatePriceDto;

  @ApiPropertyOptional({
    description: 'List of grape varieties used in the wine',
    type: [CreateGrapeVarietyDto],
    minItems: 1,
  })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateGrapeVarietyDto)
  grapeVarieties: CreateGrapeVarietyDto[];
}
