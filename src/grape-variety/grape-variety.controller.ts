import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { GrapeVarietyService } from './grape-variety.service';
import { SearchGrapeVarietyDto } from './dto/search-grape-variety.dto';
import { JwtAuthGuard } from '../auth/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('GrapeVariety')
@ApiBearerAuth()
@Controller('grape-variety')
export class GrapeVarietyController {
  constructor(private readonly grapeVarietyService: GrapeVarietyService) {}

  @Get('search')
  @UseGuards(JwtAuthGuard)
  search(@Query() searchDto: SearchGrapeVarietyDto) {
    return this.grapeVarietyService.search(searchDto);
  }
}
