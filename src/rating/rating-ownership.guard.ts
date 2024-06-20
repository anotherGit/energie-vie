import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { RatingService } from './rating.service';
import { User } from '../user/entities/user.entity';
import { RoleEnum } from '../role/role.enum';
import { validate as uuidValidate } from 'uuid';

@Injectable()
export class RatingOwnershipGuard implements CanActivate {
  constructor(private readonly ratingService: RatingService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const user = request.user as User;
    const ratingId = request.params.id;

    if (!uuidValidate(ratingId)) {
      throw new BadRequestException('Invalid UUID');
    }

    const rating = await this.ratingService.findOne(ratingId);

    if (!rating) {
      throw new ForbiddenException('Rating not found');
    }

    if (
      user.roles.some((role) => role.name === RoleEnum.Admin) ||
      rating.user.id === user.id
    ) {
      return true;
    }

    throw new ForbiddenException(
      'You do not have permission to perform this action',
    );
  }
}
