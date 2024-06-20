import { AbstractEntity } from '../../database/abstract.entity';
import { GrapeVariety } from '../../grape-variety/entities/grape-variety.entity';
import { Price } from '../../price/entities/price.entity';
import { Rating } from '../../rating/entities/rating.entity';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { WineType } from '../wine-type.enum';

@Entity()
export class WineBottle extends AbstractEntity<WineBottle> {
  @Column({ unique: true })
  externalId: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: WineType,
  })
  type: WineType;

  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'float', nullable: true })
  averageRating: number;

  @Column({ type: 'float' })
  currentPrice: number;

  @ManyToMany(() => GrapeVariety, { cascade: true })
  @JoinTable()
  grapeVarieties: GrapeVariety[];

  @OneToMany(() => Price, (price) => price.wineBottle, { cascade: true })
  prices: Price[];

  @OneToMany(() => Rating, (rating) => rating.wineBottle, { cascade: true })
  ratings: Rating[];
}
