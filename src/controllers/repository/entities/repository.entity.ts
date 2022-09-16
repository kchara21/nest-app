import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Timestamp,
  Unique,
} from 'typeorm';
import { MaxLength } from 'class-validator';
import { Tribe } from '../../tribe/entities/tribe.entity';
// import {state,status } from '../interfaces/repository.interface';

export type state = 'E' | 'D' | 'A';
export type status = 'A' | 'I';

@Entity()
@Unique(['id_repository'])
export class Repository {
  @PrimaryGeneratedColumn()
  id_repository: number;

  @ManyToOne(() => Tribe, (tribe) => tribe.repositories, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  tribe: Tribe;

  @Column({ nullable: false })
  @MaxLength(50)
  name: string;

  @Column({ nullable: false })
  state: string;

  @Column({ nullable: false, type: 'json' })
  @CreateDateColumn()
  create_time: Timestamp;

  @Column({ nullable: false })
  status: string;
}
