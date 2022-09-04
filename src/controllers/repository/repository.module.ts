import { Module } from '@nestjs/common';
import { RepositoryService } from './repository.service';
import { RepositoryController } from './repository.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from './entities/repository.entity';
import { Metric } from '../metric/entities/entity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Repository, Metric])],
  controllers: [RepositoryController],
  providers: [RepositoryService],
})
export class RepositoryModule {}
