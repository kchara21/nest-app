import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository as Repo } from './entities/repository.entity';
import { Repository } from 'typeorm';
import * as moment from 'moment';
import * as fs from 'fs';
import * as fastcsv from 'fast-csv';
import { Metric } from '../metric/entities/entity.entity';
import { ApiResponse } from '../../shared/dto/api-response.dto';
import {
  Repository_Interface,
  RespositoryMock,
} from './interfaces/repository.interface';
@Injectable()
export class RepositoryService {
  private readonly logger = new Logger(RepositoryService.name);
  constructor(
    @InjectRepository(Repo)
    private organizationRepo: Repository<Repo>,
    @InjectRepository(Metric)
    private metricRepo: Repository<Metric>,
  ) {}

  async findRepositoriesByTribe(id: string) {
    const currentDate = moment().year() + '-01-01  00:00:00.000';
    const metricRepository: Metric[] = await this.metricRepo
      .createQueryBuilder('metric')
      .innerJoinAndSelect('metric.repository', 'repository')
      .innerJoinAndSelect('repository.tribe', 'tribe')
      .innerJoinAndSelect('tribe.organization', 'organization')
      .where('tribe.id_tribe=:id', { id: +id })
      .andWhere('repository.status=:status', { status: 'A' })
      .andWhere('repository.create_time >= :create_time', {
        create_time: currentDate,
      })
      .getMany();

    if (metricRepository.length < 1) {
      this.logger.debug('La Tribu no se encuentra registrada');
      throw new NotFoundException('La Tribu no se encuentra registrada');
    }

    const metricsCoverage = metricRepository.filter(
      (metric) => metric.coverage > 75,
    );

    if (metricsCoverage.length < 1) {
      this.logger.debug(
        'La Tribu no tiene repositorios que cumplan con la cobertura necesaria',
      );
      throw new NotFoundException(
        'La Tribu no tiene repositorios que cumplan con la cobertura necesaria',
      );
    }

    return metricsCoverage;

    const metrics = this.asignVerificationCode(metricsCoverage);
    return metrics;
  }

  async asignVerificationCode(metricsCoverage: any) {
    const repositories: Repository_Interface[] = [];
    const repositoriesState: RespositoryMock[] =
      await this.getRepositoriesMock();

    for (const metric of metricsCoverage) {
      const stateEntity = repositoriesState.find(
        (item) => item.id === metric.repository.id_repository,
      );
      if (!stateEntity) return;

      const repository_verificationState =
        await this.resolveMockVerificationCode(stateEntity.state);

      repositories.push({
        id: metric.repository.id_repository,
        name: metric.repository.name,
        tribe: metric.repository.tribe.name,
        organization: metric.repository.tribe.organization.name,
        coverage: metric.coverage + '%',
        codeSmells: metric.code_smells,
        bugs: metric.bugs,
        vulnerabilities: metric.vulnerabilities,
        hotspots: metric.hotspot,
        verificationState: repository_verificationState,
        state: this.resolveVerificationCode(metric.repository.state),
      });
    }

    return { repositories: repositories };
  }

  async exportReportByTribe(id: string) {
    const repositories: any = await this.findRepositoriesByTribe(id);
    const ws = fs.createWriteStream(`repositories.csv`);
    fastcsv.write(repositories, { headers: true }).pipe(ws);
    return new ApiResponse('Exportacion exitosa');
  }

  async getRepositoriesMock() {
    const repoDataSource: Repo[] = await this.organizationRepo.find({
      where: { status: 'A' },
    });
    let stateCode = 603;
    const repositories: RespositoryMock[] = [];

    if (repoDataSource.length < 1) {
      this.logger.debug('No se encontraron repositorios');
      throw new NotFoundException('No se encontraron repositorios');
    }
    for await (const repo of repoDataSource) {
      stateCode++;
      repositories.push({ id: repo.id_repository, state: stateCode });
      if (stateCode > 605) stateCode = 603;
    }
    return repositories;
  }

  resolveVerificationCode(code: string) {
    const verificationState: any = {
      E: 'Enabled',
      D: 'Disabled',
      A: 'Archived',
    };

    return verificationState[code];
  }

  resolveMockVerificationCode(code: number) {
    const verificationCodeResolver: any = {
      604: 'Verificado',
      605: 'En espera',
      606: 'Aprobado',
    };

    return verificationCodeResolver[code];
  }
}
