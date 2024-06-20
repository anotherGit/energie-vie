import { Module } from '@nestjs/common';
import { GrapeVarietyService } from './grape-variety.service';
import { GrapeVarietyController } from './grape-variety.controller';
import { GrapeVariety } from './entities/grape-variety.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([GrapeVariety])],
  controllers: [GrapeVarietyController],
  providers: [GrapeVarietyService],
  exports: [GrapeVarietyService],
})
export class GrapeVarietyModule {}
