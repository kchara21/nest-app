import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Length } from 'class-validator';
import { Organization } from '../../organization/entities/organization.entity';
import { Repository } from '../../repository/entities/repository.entity';

@Entity()
@Unique(['id_tribe'])
export class Tribe {
  @PrimaryGeneratedColumn()
  id_tribe: number;

  @ManyToOne(() => Organization, (organization) => organization.tribes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  organization: Organization;

  @OneToMany(() => Repository, (repository) => repository.tribe, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  repositories: Repository[];

  @Column({ nullable: false })
  @Length(50)
  name: string;

  @Column({ nullable: false, default: 1 })
  status: number;
}
