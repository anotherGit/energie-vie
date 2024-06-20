import { Module } from '@nestjs/common';
import { SavedSearchService } from './saved-search.service';
import { SavedSearchController } from './saved-search.controller';
import { SavedSearch } from './entities/saved-search.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([SavedSearch]), UserModule],
  controllers: [SavedSearchController],
  providers: [SavedSearchService],
})
export class SavedSearchModule {}
