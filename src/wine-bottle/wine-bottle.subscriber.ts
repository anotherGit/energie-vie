import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { WineBottle } from './entities/wine-bottle.entity';
import { ModuleRef } from '@nestjs/core';
import { SavedSearchService } from '../saved-search/saved-search.service';

@EventSubscriber()
export class WineBottleSubscriber
  implements EntitySubscriberInterface<WineBottle>
{
  private savedSearchService: SavedSearchService;

  constructor(
    dataSource: DataSource,
    private readonly moduleRef: ModuleRef,
  ) {
    dataSource.subscribers.push(this);
    setImmediate(() => {
      this.savedSearchService = this.moduleRef.get(SavedSearchService, {
        strict: false,
      });
    });
  }

  listenTo() {
    return WineBottle;
  }

  async afterInsert(event: InsertEvent<WineBottle>) {
    if (this.savedSearchService) {
      await this.savedSearchService.notifyMatchingSearches(event.entity);
    }
  }
}
