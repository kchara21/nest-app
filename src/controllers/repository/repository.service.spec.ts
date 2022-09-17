import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RepositoryService } from './repository.service';
import { Metric } from '../metric/entities/entity.entity';

describe('Repository Service', () => {
  const mockMetricsRepositoriesByTribe: any = {
    id_metric: 25,
    coverage: '78.00',
    bugs: 5,
    vulnerabilities: 3,
    hotspot: 2,
    code_smells: 1,
    repository: {
      id_repository: 29,
      name: 'repo_nttdata2',
      state: 'E',
      create_time: '2022-08-28T18:33:58.501Z',
      status: 'A',
      tribe: {
        id_tribe: 23,
        name: 'tribe_front_02',
        status: 1,
        organization: {
          id_organization: 27,
          name: 'kchara',
          status: 1,
        },
      },
    },
  };

  const mockMetricRepositoriesByTribeResolved: any = {
    id_metric: 25,
    coverage: '78.00',
    bugs: 5,
    vulnerabilities: 3,
    hotspot: 2,
    code_smells: 1,
    repository: {
      id_repository: 29,
      name: 'repo_nttdata2',
      state: 'Enabled',
      create_time: '2022-08-28T18:33:58.501Z',
      status: 'A',
      tribe: {
        id_tribe: 23,
        name: 'tribe_front_02',
        status: 1,
        organization: {
          id_organization: 27,
          name: 'kchara',
          status: 1,
        },
      },
      verificationState: 'Verificado',
    },
  };

  const mockMetricRepository = {
    createQueryBuilder: jest.fn(() => ({
      innerJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockReturnValue([mockMetricsRepositoriesByTribe]),
      filter: jest.fn().mockReturnThis(),
    })),
  };

  let service: RepositoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RepositoryService,
        {
          provide: getRepositoryToken(Metric),
          useValue: mockMetricRepository,
        },
      ],
    }).compile();

    service = module.get<RepositoryService>(RepositoryService);
  });

  it('Debe estar definido', () => {
    expect(service).toBeDefined();
  });

  it('Obtener métricas de repositorios por tribu', async () => {
    const repositoriesByTribeMocked = [{ id: 29, state: 604 }];

    try {
      const metricsResponse = await service.getRepositoriesVerificationMock([
        mockMetricsRepositoriesByTribe,
      ]);

      expect(metricsResponse).toEqual(repositoriesByTribeMocked);
    } catch (e) {
      expect(e.message).toEqual('La Tribu no se encuentra registrada');
    }
  });

  it('Tribu inexistente', async () => {
    const idTribe = 23;
    jest.spyOn(mockMetricRepository, 'createQueryBuilder').mockReturnValueOnce({
      innerJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockReturnValue([]),
      filter: jest.fn().mockReturnThis(),
    });

    try {
      await service.findRepositoriesByTribe(idTribe + '');
    } catch (e) {
      expect(e.message).toEqual('La Tribu no se encuentra registrada');
    }
  });

  it('Información de verificación.', async () => {
    const idTribe = 23;
    try {
      const metricsResponse = await service.findRepositoriesByTribe(
        idTribe + '',
      );

      expect(metricsResponse).toEqual([mockMetricRepositoriesByTribeResolved]);
    } catch (e) {
      expect(e.message).toEqual('La Tribu no se encuentra registrada');
    }
  });

  it('Tribu no tiene repositorios que cumplan con la cobertura', async () => {
    const mockMetricByTribeWithoutCoverage = {
      id_metric: 25,
      coverage: '74.00',
      bugs: 5,
      vulnerabilities: 3,
      hotspot: 2,
      code_smells: 1,
      repository: {
        id_repository: 29,
        name: 'repo_nttdata2',
        state: 'Enabled',
        create_time: '2022-08-28T18:33:58.501Z',
        status: 'A',
        tribe: {
          id_tribe: 23,
          name: 'tribe_front_02',
          status: 1,
          organization: {
            id_organization: 27,
            name: 'kchara',
            status: 1,
          },
        },
        verificationState: 'Verificado',
      },
    };

    jest.spyOn(mockMetricRepository, 'createQueryBuilder').mockReturnValueOnce({
      innerJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockReturnValue([mockMetricByTribeWithoutCoverage]),
      filter: jest.fn().mockReturnThis(),
    });

    try {
      await service.findRepositoriesByTribe(23 + '');
    } catch (e) {
      expect(e.message).toEqual(
        'La Tribu no tiene repositorios que cumplan con la cobertura necesaria',
      );
    }
  });
});
