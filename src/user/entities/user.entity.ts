import { AbstractEntity } from '../../database/abstract.entity';
import { Rating } from '../../rating/entities/rating.entity';
import { Role } from '../../role/entities/role.entity';
import { SavedSearch } from '../../saved-search/entities/saved-search.entity';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';

@Entity()
export class User extends AbstractEntity<User> {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Rating, (rating) => rating.user)
  ratings: Rating[];

  @OneToMany(() => SavedSearch, (savedSearch) => savedSearch.user)
  savedSearches: SavedSearch[];

  @ManyToMany(() => Role)
  @JoinTable()
  roles: Role[];
}
