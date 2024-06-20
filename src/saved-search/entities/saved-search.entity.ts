import { AbstractEntity } from '../../database/abstract.entity';
import { User } from '../../user/entities/user.entity';
import { WineType } from '../../wine-bottle/wine-type.enum';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class SavedSearch extends AbstractEntity<SavedSearch> {
  @Column()
  searchName: string;

  @Column({
    type: 'enum',
    enum: WineType,
    array: true,
    default: [],
  })
  types: WineType[];

  @Column({ type: 'int', nullable: true })
  min_year?: number;

  @Column({ type: 'int', nullable: true })
  max_year?: number;

  @Column({ type: 'float', nullable: true })
  min_averageRating?: number;

  @Column({ type: 'float', nullable: true })
  min_price?: number;

  @Column({ type: 'float', nullable: true })
  max_price?: number;

  @ManyToOne(() => User, (user) => user.savedSearches)
  user: User;
}
