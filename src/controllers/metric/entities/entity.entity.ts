import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Max } from 'class-validator';
import { Repository } from '../../repository/entities/repository.entity';

@Entity()
@Unique(['id_metric'])
export class Metric {
  @PrimaryGeneratedColumn()
  id_metric: number;

  @OneToOne(() => Repository, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn()
  repository: Repository;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  @Max(100)
  coverage: number;

  @Column({ nullable: false })
  bugs: number;

  @Column({ nullable: false })
  vulnerabilities: number;

  @Column({ nullable: false })
  hotspot: number;

  @Column({ nullable: false })
  code_smells: number;
}
