import { AbstractEntity } from '../../database/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class GrapeVariety extends AbstractEntity<GrapeVariety> {
  @Column({ unique: true })
  name: string;
}
