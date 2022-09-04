import { Controller, Get, Param } from '@nestjs/common';
import { RepositoryService } from './repository.service';

@Controller('repositories')
export class RepositoryController {
  constructor(private readonly repositoryService: RepositoryService) {}

  @Get('tribe/:id')
  findAll(@Param('id') id: string) {
    return this.repositoryService.findRepositoriesByTribe(id);
  }
}
