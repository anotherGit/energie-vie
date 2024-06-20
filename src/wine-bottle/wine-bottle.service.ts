import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWineBottleDto } from './dto/create-wine-bottle.dto';
import { UpdateWineBottleDto } from './dto/update-wine-bottle.dto';
import { Repository } from 'typeorm';
import { WineBottle } from './entities/wine-bottle.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SearchWineBottleDto } from './dto/search-wine-bottle.dto';
import { WineSortBy } from './wine-bottle-sort-by.enum';
import { SearchWineBottleByTextDto } from './dto/search-wine-botlle-by-text.dto';
import { Price } from '../price/entities/price.entity';
import { GrapeVariety } from '../grape-variety/entities/grape-variety.entity';
import { GrapeVarietyService } from '../grape-variety/grape-variety.service';

@Injectable()
export class WineBottleService {
  constructor(
    @InjectRepository(WineBottle)
    private readonly wineBottleRepository: Repository<WineBottle>,
    private readonly grapeVarietyService: GrapeVarietyService,
  ) {}

  async create(createWineBottleDto: CreateWineBottleDto) {
    const price = new Price(createWineBottleDto.price);

    const existingGrapeVarieties = await this.grapeVarietyService.getByNames(
      createWineBottleDto.grapeVarieties.map((gv) => gv.name),
    );

    const newGrapeVarieties = createWineBottleDto.grapeVarieties
      .filter(
        (gv) =>
          !existingGrapeVarieties.some(
            (existingGV) => existingGV.name === gv.name,
          ),
      )
      .map((gv) => new GrapeVariety(gv));

    const grapeVarieties = [...existingGrapeVarieties, ...newGrapeVarieties];

    const wineBottle = new WineBottle({
      ...createWineBottleDto,
      averageRating: null,
      currentPrice: price.value,
      prices: [price],
      grapeVarieties,
    });
    await this.wineBottleRepository.save(wineBottle);
  }

  findOne(id: string) {
    return this.wineBottleRepository.findOne({
      where: { id },
      relations: { grapeVarieties: true, ratings: true, prices: true },
    });
  }

  findByExternalId(externalId: string) {
    return this.wineBottleRepository.findOne({
      where: { externalId },
    });
  }

  findLastCreated() {
    return this.wineBottleRepository.findOne({
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, updateWineBottleDto: UpdateWineBottleDto) {
    const wineBottle = await this.wineBottleRepository.findOne({
      where: { id },
      relations: { prices: true },
    });
    if (!wineBottle) {
      throw new NotFoundException(`WineBottle with id ${id} not found`);
    }

    wineBottle.name = updateWineBottleDto.name;
    wineBottle.type = updateWineBottleDto.type;
    wineBottle.year = updateWineBottleDto.year;

    if (
      updateWineBottleDto.price &&
      updateWineBottleDto.price.value &&
      updateWineBottleDto.price.value != wineBottle.currentPrice
    ) {
      const price = new Price(updateWineBottleDto.price);
      wineBottle.currentPrice = price.value;
      wineBottle.prices = [...wineBottle.prices, price];
    }

    if (
      updateWineBottleDto.grapeVarieties &&
      updateWineBottleDto.grapeVarieties.length > 0
    ) {
      const existingGrapeVarieties = await this.grapeVarietyService.getByNames(
        updateWineBottleDto.grapeVarieties.map((gv) => gv.name),
      );

      const newGrapeVarieties = updateWineBottleDto.grapeVarieties
        .filter(
          (gv) =>
            !existingGrapeVarieties.some(
              (existingGV) => existingGV.name === gv.name,
            ),
        )
        .map((gv) => new GrapeVariety(gv));

      const grapeVarieties = [...existingGrapeVarieties, ...newGrapeVarieties];
      wineBottle.grapeVarieties = grapeVarieties;
    }

    await this.wineBottleRepository.save(wineBottle);
  }

  async computeAverageRating(id: string) {
    const wineBottle = await this.wineBottleRepository.findOne({
      where: { id },
      relations: { ratings: true },
    });
    if (!wineBottle) {
      throw new Error(`WineBottle with id ${id} not found`);
    }

    if (wineBottle.ratings && wineBottle.ratings.length > 0) {
      const sum = wineBottle.ratings.reduce((acc, el) => acc + el.value, 0);
      const averageRating = parseFloat(
        (sum / wineBottle.ratings.length).toFixed(2),
      );
      wineBottle.averageRating = averageRating;
    } else {
      wineBottle.averageRating = null;
    }

    await this.wineBottleRepository.save(wineBottle);
  }

  async searchByText(searchWineBotlleByTextDto: SearchWineBottleByTextDto) {
    // maybe think about using a microservice with elasticSearch to improve the text search

    const query = this.wineBottleRepository.createQueryBuilder('wineBottle');

    if (searchWineBotlleByTextDto.q) {
      query.andWhere('wineBottle.name ILIKE :name', {
        name: `%${searchWineBotlleByTextDto.q}%`,
      });
      // add other text fields
    }

    const sortBy = searchWineBotlleByTextDto.sortBy || WineSortBy.RATING_DESC;

    switch (sortBy) {
      case WineSortBy.PRICE_ASC:
        query.addOrderBy('wineBottle.currentPrice', 'ASC');
        break;
      case WineSortBy.PRICE_DESC:
        query.addOrderBy('wineBottle.currentPrice', 'DESC');
        break;
      case WineSortBy.RATING_ASC:
        query.addOrderBy('wineBottle.averageRating', 'ASC');
        break;
      case WineSortBy.RATING_DESC:
        query.addOrderBy('wineBottle.averageRating', 'DESC');
        break;
      case WineSortBy.YEAR_ASC:
        query.addOrderBy('wineBottle.year', 'ASC');
        break;
      case WineSortBy.YEAR_DESC:
        query.addOrderBy('wineBottle.year', 'DESC');
        break;
      default:
        query.addOrderBy('wineBottle.averageRating', 'DESC');
        break;
    }

    const page = Math.max(1, searchWineBotlleByTextDto.page || 1);
    const limit = Math.max(
      1,
      Math.min(50, searchWineBotlleByTextDto.limit || 10),
    );
    query.skip((page - 1) * limit).take(limit);

    const [result, total] = await query.getManyAndCount();

    return {
      data: result,
      total,
      page,
      limit,
    };
  }

  async search(searchDto: SearchWineBottleDto) {
    const query = this.wineBottleRepository.createQueryBuilder('wineBottle');

    if (searchDto.types && searchDto.types.length > 0) {
      query.andWhere('wineBottle.type IN (:...types)', {
        types: searchDto.types,
      });
    }
    if (searchDto.min_year) {
      query.andWhere('wineBottle.year >= :min_year', {
        min_year: searchDto.min_year,
      });
    }
    if (searchDto.max_year) {
      query.andWhere('wineBottle.year <= :max_year', {
        max_year: searchDto.max_year,
      });
    }
    if (searchDto.min_averageRating) {
      query.andWhere('wineBottle.averageRating >= :min_averageRating', {
        min_averageRating: searchDto.min_averageRating,
      });
    }
    if (searchDto.min_price) {
      query.andWhere('wineBottle.currentPrice >= :min_price', {
        min_price: searchDto.min_price,
      });
    }
    if (searchDto.max_price) {
      query.andWhere('wineBottle.currentPrice <= :max_price', {
        max_price: searchDto.max_price,
      });
    }

    const sortBy = searchDto.sortBy || WineSortBy.RATING_DESC;

    switch (sortBy) {
      case WineSortBy.PRICE_ASC:
        query.addOrderBy('wineBottle.currentPrice', 'ASC');
        break;
      case WineSortBy.PRICE_DESC:
        query.addOrderBy('wineBottle.currentPrice', 'DESC');
        break;
      case WineSortBy.RATING_ASC:
        query.addOrderBy('wineBottle.averageRating', 'ASC');
        break;
      case WineSortBy.RATING_DESC:
        query.addOrderBy('wineBottle.averageRating', 'DESC');
        break;
      case WineSortBy.YEAR_ASC:
        query.addOrderBy('wineBottle.year', 'ASC');
        break;
      case WineSortBy.YEAR_DESC:
        query.addOrderBy('wineBottle.year', 'DESC');
        break;
      default:
        query.addOrderBy('wineBottle.averageRating', 'DESC');
        break;
    }

    const page = Math.max(1, searchDto.page || 1);
    const limit = Math.max(1, Math.min(50, searchDto.limit || 10));
    query.skip((page - 1) * limit).take(limit);

    const [result, total] = await query.getManyAndCount();

    return {
      data: result,
      total,
      page,
      limit,
    };
  }
}
