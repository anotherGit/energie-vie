import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { SavedSearchService } from '../saved-search/saved-search.service';
import { User } from '../user/entities/user.entity';
import { RoleEnum } from '../role/role.enum';
import { validate as uuidValidate } from 'uuid';

@Injectable()
export class SavedSearchOwnershipGuard implements CanActivate {
  constructor(private readonly savedSearchService: SavedSearchService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const user = request.user as User;
    const savedSearchId = request.params.id;

    if (!uuidValidate(savedSearchId)) {
      throw new BadRequestException('Invalid UUID');
    }

    const savedSearch = await this.savedSearchService.findOne(savedSearchId);

    if (!savedSearch) {
      throw new ForbiddenException('SavedSearch not found');
    }

    if (
      user.roles.some((role) => role.name === RoleEnum.Admin) ||
      savedSearch.user.id === user.id
    ) {
      return true;
    }

    throw new ForbiddenException(
      'You do not have permission to perform this action',
    );
  }
}
