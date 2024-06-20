import { Module } from '@nestjs/common';
import { Price } from './entities/price.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Price])],
  controllers: [],
  providers: [],
})
export class PriceModule {}
