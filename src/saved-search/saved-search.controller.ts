import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ParseUUIDPipe,
} from '@nestjs/common';
import { SavedSearchService } from './saved-search.service';
import { CreateSavedSearchDto } from './dto/create-saved-search.dto';
import { UpdateSavedSearchDto } from './dto/update-saved-search.dto';
import { JwtAuthGuard } from '../auth/auth.guard';
import { SavedSearchOwnershipGuard } from './saved-search-ownership.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('SavedSearch')
@ApiBearerAuth()
@Controller('saved-search')
export class SavedSearchController {
  constructor(private readonly savedSearchService: SavedSearchService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Req() req: any, @Body() createSavedSearchDto: CreateSavedSearchDto) {
    const userId = req.user.id;
    return this.savedSearchService.create(userId, createSavedSearchDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAllByUser(@Req() req: any) {
    const userId = req.user.id;
    return this.savedSearchService.findAllByUserId(userId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, SavedSearchOwnershipGuard)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSavedSearchDto: UpdateSavedSearchDto,
  ) {
    return this.savedSearchService.update(id, updateSavedSearchDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, SavedSearchOwnershipGuard)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.savedSearchService.remove(id);
  }
}
