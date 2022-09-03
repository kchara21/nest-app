import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { MaxLength } from 'class-validator';
import { Tribe } from '../../tribe/entities/tribe.entity';

@Entity()
@Unique(['id_organization'])
export class Organization {
  @PrimaryGeneratedColumn()
  id_organization: number;

  @OneToMany(() => Tribe, (tribe) => tribe.organization, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  tribes: Tribe[];

  @Column({ nullable: false })
  @MaxLength(50)
  name: string;

  @Column({ nullable: false, default: 1 })
  status: number;
}
