import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as moment from 'moment';
import * as fs from 'fs';
import * as fastcsv from 'fast-csv';
import { Metric } from '../metric/entities/entity.entity';
import { ApiResponse } from '../../shared/dto/api-response.dto';
import { Metric_Repositories_By_Tribe } from '../metric/interfaces/metric-repositories-by-tribe.interface';
import { MetricsResponse } from '../metric/dto/response-metric-repositories-by-tribe.dto';
import { RespositoryMock } from './interfaces/repository.interface';
@Injectable()
export class RepositoryService {
  private readonly logger = new Logger(RepositoryService.name);
  constructor(
    @InjectRepository(Metric)
    private metricRepo: Repository<Metric>,
  ) {}

  async findRepositoriesByTribe(id: string) {
    const currentDate = moment().year() + '-01-01  00:00:00.000';
    const metricsRepositoriesByTribe: Metric[] = await this.metricRepo
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

    if (metricsRepositoriesByTribe.length < 1) {
      throw new NotFoundException('La Tribu no se encuentra registrada');
    }

    const withCoverage_metricsRepositoriesByTribe =
      metricsRepositoriesByTribe.filter((metric) => metric.coverage > 75);

    if (withCoverage_metricsRepositoriesByTribe.length < 1) {
      throw new NotFoundException(
        'La Tribu no tiene repositorios que cumplan con la cobertura necesaria',
      );
    }

    const response_MetricsRepositoriesByTribe: Metric_Repositories_By_Tribe[] =
      await this.asignVerificationCode(withCoverage_metricsRepositoriesByTribe);

    return response_MetricsRepositoriesByTribe;
  }

  async asignVerificationCode(
    withCoverage_metricsRepositoriesByTribe: any,
  ): Promise<MetricsResponse[]> {
    const responseMetricsRepositoriesByTribe: any = [];
    const repositoriesByTribeMocked: RespositoryMock[] =
      await this.getRepositoriesVerificationMock(
        withCoverage_metricsRepositoriesByTribe,
      );

    for (const dataMetric of withCoverage_metricsRepositoriesByTribe) {
      const repositoryMocked: RespositoryMock = repositoriesByTribeMocked.find(
        (item) => item.id === dataMetric.repository.id_repository,
      );

      const repository_verificationStateResolve =
        await this.resolveMockVerificationCode(repositoryMocked.state);

      const stateResolved = await this.resolveStateCode(
        dataMetric.repository.state,
      );

      responseMetricsRepositoriesByTribe.push({
        ...dataMetric,
        repository: {
          ...dataMetric.repository,
          state: stateResolved,
          verificationState: repository_verificationStateResolve,
        },
      });
    }
    return responseMetricsRepositoriesByTribe;
  }

  async getRepositoriesVerificationMock(
    metricsRepositoriesByTribeWithCoverage: Metric_Repositories_By_Tribe[],
  ) {
    let stateCode = 603;
    const repositoriesCodeVerification: RespositoryMock[] = [];

    if (metricsRepositoriesByTribeWithCoverage.length < 1) {
      throw new NotFoundException('No se encontraron repositorios');
    }

    for await (const repo of metricsRepositoriesByTribeWithCoverage) {
      stateCode++;
      repositoriesCodeVerification.push({
        id: repo.repository.id_repository,
        state: stateCode,
      });
      if (stateCode > 605) stateCode = 603;
    }

    return repositoriesCodeVerification;
  }

  async resolveStateCode(code: string) {
    const verificationState: any = {
      E: 'Enabled',
      D: 'Disabled',
      A: 'Archived',
    };

    return verificationState[code];
  }

  async resolveMockVerificationCode(code: number) {
    const verificationCodeResolver: any = {
      604: 'Verificado',
      605: 'En espera',
      606: 'Aprobado',
    };

    return verificationCodeResolver[code];
  }

  async exportReportByTribe(id: string) {
    const repositories: Metric_Repositories_By_Tribe[] =
      await this.findRepositoriesByTribe(id);
    const ws = fs.createWriteStream(`repositories.csv`);
    fastcsv.write(repositories, { headers: true }).pipe(ws);
    return new ApiResponse('Exportacion exitosa');
  }
}
