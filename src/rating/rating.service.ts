import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { WineBottleService } from '../wine-bottle/wine-bottle.service';
import { Repository } from 'typeorm';
import { Rating } from './entities/rating.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class RatingService {
  constructor(
    @InjectRepository(Rating)
    private readonly ratingRepository: Repository<Rating>,
    private readonly wineBottleService: WineBottleService,
    private readonly userService: UserService,
  ) {}

  async create(userId: string, createRatingDto: CreateRatingDto) {
    const wineBottle = await this.wineBottleService.findOne(
      createRatingDto.wineBottleId,
    );
    if (!wineBottle) {
      throw new NotFoundException('WineBottle not found');
    }

    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const rating = new Rating({
      ...createRatingDto,
      wineBottle,
      user,
    });

    await this.ratingRepository.save(rating);
    await this.wineBottleService.computeAverageRating(wineBottle.id);
  }

  findOne(id: string) {
    return this.ratingRepository.findOne({
      where: { id },
      relations: { wineBottle: true, user: true },
    });
  }

  async update(id: string, updateRatingDto: UpdateRatingDto) {
    const rating = await this.ratingRepository.findOne({
      where: { id },
      relations: { wineBottle: true },
    });
    if (!rating) {
      throw new NotFoundException(`Rating with id ${id} not found`);
    }

    rating.value = updateRatingDto.value;
    rating.comment = updateRatingDto.comment;

    await this.ratingRepository.save(rating);
    await this.wineBottleService.computeAverageRating(rating.wineBottle.id);
  }

  async remove(id: string) {
    const rating = await this.ratingRepository.findOne({
      where: { id },
      relations: { wineBottle: true },
    });
    if (!rating) {
      throw new NotFoundException(`Rating with id ${id} not found`);
    }

    await this.ratingRepository.delete(id);
    await this.wineBottleService.computeAverageRating(rating.wineBottle.id);
  }
}
