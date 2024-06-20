import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { WineBottleService } from './wine-bottle.service';
import { JwtAuthGuard } from '../auth/auth.guard';
import { SearchWineBottleDto } from './dto/search-wine-bottle.dto';
import { SearchWineBottleByTextDto } from './dto/search-wine-botlle-by-text.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../role/role.guard';
import { RoleEnum } from '../role/role.enum';
import { CreateWineBottleDto } from './dto/create-wine-bottle.dto';
import { Roles } from '../role/role.decorator';
import { UpdateWineBottleDto } from './dto/update-wine-bottle.dto';

@ApiTags('WineBottle')
@ApiBearerAuth()
@Controller('wine-bottle')
export class WineBottleController {
  constructor(private readonly wineBottleService: WineBottleService) {}

  @Get('detail/:id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.wineBottleService.findOne(id);
  }

  @Get('search')
  @UseGuards(JwtAuthGuard)
  async search(@Query() searchDto: SearchWineBottleDto) {
    return this.wineBottleService.search(searchDto);
  }

  @Get('searchByText')
  @UseGuards(JwtAuthGuard)
  async searchByText(@Query() searchDto: SearchWineBottleByTextDto) {
    return this.wineBottleService.searchByText(searchDto);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.Admin)
  create(@Body() createDto: CreateWineBottleDto) {
    return this.wineBottleService.create(createDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.Admin)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateWineBottleDto,
  ) {
    return this.wineBottleService.update(id, updateDto);
  }
}
