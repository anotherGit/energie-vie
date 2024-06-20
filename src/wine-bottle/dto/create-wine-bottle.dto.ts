import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { WineType } from '../wine-type.enum';
import { CreatePriceDto } from '../../price/dto/create-price.dto';
import { CreateGrapeVarietyDto } from '../../grape-variety/dto/create-grape-variety.dto';
import { Type } from 'class-transformer';

export class CreateWineBottleDto {
  @ApiProperty({
    description: 'External identifier for the wine bottle',
    example: 'ext-12345',
  })
  @IsNotEmpty()
  @IsString()
  externalId: string;

  @ApiProperty({
    description: 'Name of the wine bottle',
    example: 'Chateau Margaux',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Type of wine',
    example: 'rouge',
    enum: WineType,
  })
  @IsNotEmpty()
  @IsEnum(WineType)
  type: WineType;

  @ApiProperty({
    description: 'Year the wine was produced',
    example: 2015,
  })
  @IsNotEmpty()
  @IsInt()
  year: number;

  @ApiProperty({
    description: 'Price details of the wine',
    type: CreatePriceDto,
  })
  @IsNotEmpty()
  price: CreatePriceDto;

  @ApiProperty({
    description: 'List of grape varieties used in the wine',
    type: [CreateGrapeVarietyDto],
    minItems: 1,
  })
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateGrapeVarietyDto)
  grapeVarieties: CreateGrapeVarietyDto[];
}
