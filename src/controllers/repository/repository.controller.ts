import { Controller, Get, Param, UseFilters } from '@nestjs/common';
import { RepositoryService } from './repository.service';
import { HttpExceptionFilter } from '../../core/filters/http-exception.filter';
import { ApiResponse } from '../../shared/dto/api-response.dto';

@Controller('repositories')
export class RepositoryController {
  constructor(private readonly repositoryService: RepositoryService) {}

  @Get('tribe/:id')
  @UseFilters(new HttpExceptionFilter())
  findAll(@Param('id') id: string) {
    return this.repositoryService.findRepositoriesByTribe(id);
  }

  @Get('tribe/:id/report')
  exportReport(@Param('id') id: string) {
    this.repositoryService.exportReportByTribe(id);
    return new ApiResponse('Exportacion exitosa');
  }
}
