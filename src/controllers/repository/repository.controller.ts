import { Controller, Get, Param, UseFilters } from '@nestjs/common';
import { RepositoryService } from './repository.service';
import { HttpExceptionFilter } from '../../core/filters/http-exception.filter';
import { ApiResponse } from '../../shared/dto/api-response.dto';
import { RepositoriesMapper } from './mapper/repositories-metrics-by-tribe.mapper';
import { RepositoryResponse } from './dto/response-repository.dto';

@Controller('repositories')
export class RepositoryController {
  constructor(private readonly repositoryService: RepositoryService) {}

  @Get('tribe/:id')
  @UseFilters(new HttpExceptionFilter())
  async findAll(@Param('id') id: string) {
    const payload: RepositoryResponse[] = [];
    const responseMetricsRepositoriesByTribe =
      await this.repositoryService.findRepositoriesByTribe(id);

    for (const metricData of responseMetricsRepositoriesByTribe) {
      const metricRepositoriesByTribeMapper =
        RepositoriesMapper.toMetricsByTribeResponse(metricData);
      payload.push(metricRepositoriesByTribeMapper);
    }

    return { repositories: payload };
  }

  @Get('tribe/:id/report')
  @UseFilters(new HttpExceptionFilter())
  exportReport(@Param('id') id: string) {
    return this.repositoryService.exportReportByTribe(id);
  }
}
