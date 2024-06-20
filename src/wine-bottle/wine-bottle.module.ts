import { Module } from '@nestjs/common';
import { WineBottleService } from './wine-bottle.service';
import { WineBottleController } from './wine-bottle.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WineBottle } from './entities/wine-bottle.entity';
import { GrapeVarietyModule } from '../grape-variety/grape-variety.module';
import { WineBottleSubscriber } from './wine-bottle.subscriber';

@Module({
  imports: [TypeOrmModule.forFeature([WineBottle]), GrapeVarietyModule],
  controllers: [WineBottleController],
  providers: [WineBottleService, WineBottleSubscriber],
  exports: [WineBottleService],
})
export class WineBottleModule {}
