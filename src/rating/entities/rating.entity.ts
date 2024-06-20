import { AbstractEntity } from '../../database/abstract.entity';
import { User } from '../../user/entities/user.entity';
import { WineBottle } from '../../wine-bottle/entities/wine-bottle.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Rating extends AbstractEntity<Rating> {
  @Column({ type: 'int' })
  value: number;

  @Column({ nullable: true })
  comment: string | null;

  @ManyToOne(() => User, (user) => user.ratings)
  user: User;

  @ManyToOne(() => WineBottle, (wineBottle) => wineBottle.ratings)
  wineBottle: WineBottle;
}
