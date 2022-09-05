import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseFilters,
} from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { Organization } from './entities/organization.entity';
import { Request } from 'express';
import { ApiResponse } from '../../shared/dto/api-response.dto';
import { HttpExceptionFilter } from '../../core/filters/http-exception.filter';

@Controller('organizations')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  @UseFilters(new HttpExceptionFilter())
  create(@Body() organization: CreateOrganizationDto) {
    this.organizationService.create(organization);
    return new ApiResponse('Usuario creado exitosamente');
  }

  @Get()
  @UseFilters(new HttpExceptionFilter())
  findAll(@Req() request: Request): Promise<Organization[]> {
    return this.organizationService.findAll(request.query);
  }

  @Get(':id')
  @UseFilters(new HttpExceptionFilter())
  findOne(@Param('id') id: string): Promise<Organization> {
    return this.organizationService.findOne(id);
  }

  @Patch(':id')
  @UseFilters(new HttpExceptionFilter())
  update(
    @Param('id') id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<Organization> {
    return this.organizationService.update(id, updateOrganizationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Organization> {
    return this.organizationService.remove(id);
  }
}
