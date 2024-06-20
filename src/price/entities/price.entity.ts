import { AbstractEntity } from '../../database/abstract.entity';
import { WineBottle } from '../../wine-bottle/entities/wine-bottle.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Price extends AbstractEntity<Price> {
  @Column({ type: 'float' })
  value: number;

  @ManyToOne(() => WineBottle, (wineBottle) => wineBottle.prices)
  wineBottle: WineBottle;
}
