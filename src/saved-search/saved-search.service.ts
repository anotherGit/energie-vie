import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSavedSearchDto } from './dto/create-saved-search.dto';
import { UpdateSavedSearchDto } from './dto/update-saved-search.dto';
import { WineBottle } from '../wine-bottle/entities/wine-bottle.entity';
import { SavedSearch } from './entities/saved-search.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';

@Injectable()
export class SavedSearchService {
  constructor(
    @InjectRepository(SavedSearch)
    private readonly savedSearchRepository: Repository<SavedSearch>,
    private readonly userService: UserService,
  ) {}

  async create(userId: string, createSavedSearchDto: CreateSavedSearchDto) {
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const savedSearch = new SavedSearch({
      ...createSavedSearchDto,
      user,
    });

    await this.savedSearchRepository.save(savedSearch);
  }

  findOne(id: string) {
    return this.savedSearchRepository.findOne({
      where: { id },
      relations: { user: true },
    });
  }

  async findAllByUserId(userId: string) {
    const savedSearches = await this.savedSearchRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return savedSearches.map(({ user, ...rest }) => rest);
  }

  async update(id: string, updateSavedSearchDto: UpdateSavedSearchDto) {
    const savedSearch = await this.savedSearchRepository.findOneBy({ id });
    if (!savedSearch) {
      throw new NotFoundException(`SavedSearch with id ${id} not found`);
    }

    savedSearch.types = updateSavedSearchDto.types;
    savedSearch.min_year = updateSavedSearchDto.min_year;
    savedSearch.max_year = updateSavedSearchDto.max_year;
    savedSearch.min_averageRating = updateSavedSearchDto.min_averageRating;
    savedSearch.min_price = updateSavedSearchDto.min_price;
    savedSearch.max_price = updateSavedSearchDto.max_price;

    await this.savedSearchRepository.save(savedSearch);
  }

  async remove(id: string) {
    await this.savedSearchRepository.delete(id);
  }

  async notifyMatchingSearches(wineBottle: WineBottle) {
    const query = this.savedSearchRepository
      .createQueryBuilder('savedSearch')
      .andWhere(
        'savedSearch.min_year IS NULL OR savedSearch.min_year <= :year',
        {
          year: wineBottle.year,
        },
      )
      .andWhere(
        'savedSearch.max_year IS NULL OR savedSearch.max_year >= :year',
        {
          year: wineBottle.year,
        },
      )
      .andWhere(
        'savedSearch.min_averageRating IS NULL OR savedSearch.min_averageRating <= :averageRating',
        { averageRating: wineBottle.averageRating },
      )
      .andWhere(
        'savedSearch.min_price IS NULL OR savedSearch.min_price <= :currentPrice',
        {
          currentPrice: wineBottle.currentPrice,
        },
      )
      .andWhere(
        'savedSearch.max_price IS NULL OR savedSearch.max_price >= :currentPrice',
        {
          currentPrice: wineBottle.currentPrice,
        },
      );

    const searches = await query.getMany();

    for (const search of searches) {
      console.log(`Match found for search: ${search.id}`);
      // push notification into rabbitMQ for a notification/mail microservice
    }
  }
}
