import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateGrapeVarietyDto {
  @ApiProperty({
    description: 'The name of the grape variety',
    example: 'Chardonnay',
    maxLength: 1000,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  name: string;
}
