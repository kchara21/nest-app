import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RepositoryService } from './repository.service';
import { Metric } from '../metric/entities/entity.entity';
import { Repository as Repo } from './entities/repository.entity';

//Obtener métricas de repositorios por tribu
describe('find metrics by repository id', () => {
  let service: RepositoryService;

  const mockRepositoriesByTribe = {
    id_metric: 25,
    coverage: '76.00',
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

  const mockRepo = {
    createQueryBuilder: jest.fn(() => ({
      innerJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockReturnValue([mockRepositoriesByTribe]),
      filter: jest.fn().mockReturnThis(),
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RepositoryService,
        {
          provide: getRepositoryToken(Metric),
          useValue: mockRepo,
        },
        {
          provide: getRepositoryToken(Repo),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<RepositoryService>(RepositoryService);
  });

  it('Obtener métricas de repositorios por tribu', async () => {
    try {
      const metricsResponse = await service.findRepositoriesByTribe(23 + '');
      expect(metricsResponse).toEqual([mockRepositoriesByTribe]);
    } catch (e) {
      expect(e.message).toEqual('La Tribu no se encuentra registrada');
    }
  });
});

//Tribu inexistente
describe('find metrics by repository id', () => {
  let service: RepositoryService;

  const mockRepo = {
    createQueryBuilder: jest.fn(() => ({
      innerJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockReturnValue([]),
      filter: jest.fn().mockReturnThis(),
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RepositoryService,
        {
          provide: getRepositoryToken(Metric),
          useValue: mockRepo,
        },
        {
          provide: getRepositoryToken(Repo),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<RepositoryService>(RepositoryService);
  });

  it('Tribu inexistente', async () => {
    try {
      await service.findRepositoriesByTribe(23 + '');
    } catch (e) {
      expect(e.message).toEqual('La Tribu no se encuentra registrada');
    }
  });

  // it('should throw exception "La Tribu no tiene repositorios que cumplan con la cobertura necesaria"', async () => {
  //   const repositoryFound = await service.findRepositoriesByTribe(23 + '');
  //   expect(repositoryFound).toMatchObject(mockRepositoriesByTribe);
  // });

  // it('should throw exception "La Tribu no se encuentra registrada"', async () => {
  //   const tribe = 24;
  // });
});

//Tribu no tiene repositorios que cumplan con la cobertura
describe('find metrics by repository id', () => {
  let service: RepositoryService;

  const mockRepositoriesByTribe = {
    id_metric: 25,
    coverage: '73.00',
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

  const mockRepo = {
    createQueryBuilder: jest.fn(() => ({
      innerJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockReturnValue([mockRepositoriesByTribe]),
      filter: jest.fn().mockReturnThis(),
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RepositoryService,
        {
          provide: getRepositoryToken(Metric),
          useValue: mockRepo,
        },
        {
          provide: getRepositoryToken(Repo),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<RepositoryService>(RepositoryService);
  });

  it('Tribu no tiene repositorios que cumplan con la cobertura', async () => {
    try {
      const metricsResponse = await service.findRepositoriesByTribe(23 + '');
      expect(metricsResponse).toEqual([mockRepositoriesByTribe]);
    } catch (e) {
      expect(e.message).toEqual(
        'La Tribu no tiene repositorios que cumplan con la cobertura necesaria',
      );
    }
  });
});
