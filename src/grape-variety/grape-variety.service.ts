import { Injectable } from '@nestjs/common';
import { GrapeVariety } from './entities/grape-variety.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SearchGrapeVarietyDto } from './dto/search-grape-variety.dto';

@Injectable()
export class GrapeVarietyService {
  constructor(
    @InjectRepository(GrapeVariety)
    private readonly grapeVarietyRepository: Repository<GrapeVariety>,
  ) {}

  async search(searchDto: SearchGrapeVarietyDto) {
    const query =
      this.grapeVarietyRepository.createQueryBuilder('grapeVariety');

    if (searchDto.name) {
      query.andWhere('grapeVariety.name ILIKE :name', {
        name: `%${searchDto.name}%`,
      });
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

  getByIds(grapeVarietyIds: string[]) {
    return this.grapeVarietyRepository.find({
      where: { id: In(grapeVarietyIds) },
    });
  }

  getByNames(names: string[]) {
    return this.grapeVarietyRepository.find({
      where: { name: In(names) },
    });
  }
}
