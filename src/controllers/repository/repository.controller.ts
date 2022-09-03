import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RepositoryService } from './repository.service';
import { CreateRepositoryDto } from './dto/create-repository.dto';
import { UpdateRepositoryDto } from './dto/update-repository.dto';

@Controller('repository')
export class RepositoryController {
  constructor(private readonly repositoryService: RepositoryService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.repositoryService.findOne(+id);
  }
}
