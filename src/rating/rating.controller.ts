import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Post,
  Req,
  ParseUUIDPipe,
} from '@nestjs/common';
import { RatingService } from './rating.service';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { JwtAuthGuard } from '../auth/auth.guard';
import { RatingOwnershipGuard } from './rating-ownership.guard';
import { CreateRatingDto } from './dto/create-rating.dto';
import { RolesGuard } from '../role/role.guard';
import { Roles } from '../role/role.decorator';
import { RoleEnum } from '../role/role.enum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Rating')
@ApiBearerAuth()
@Controller('rating')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.Expert, RoleEnum.Admin)
  create(@Req() req: any, @Body() createRatingDto: CreateRatingDto) {
    const userId = req.user.id;
    return this.ratingService.create(userId, createRatingDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.ratingService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard, RatingOwnershipGuard)
  @Roles(RoleEnum.Expert, RoleEnum.Admin)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRatingDto: UpdateRatingDto,
  ) {
    return this.ratingService.update(id, updateRatingDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard, RatingOwnershipGuard)
  @Roles(RoleEnum.Expert, RoleEnum.Admin)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.ratingService.remove(id);
  }
}
