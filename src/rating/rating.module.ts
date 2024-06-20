import { Module } from '@nestjs/common';
import { RatingService } from './rating.service';
import { RatingController } from './rating.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rating } from './entities/rating.entity';
import { WineBottleModule } from '../wine-bottle/wine-bottle.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Rating]), WineBottleModule, UserModule],
  controllers: [RatingController],
  providers: [RatingService],
})
export class RatingModule {}
