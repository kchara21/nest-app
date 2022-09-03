import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { Organization } from './entities/organization.entity';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private organizationRepo: Repository<Organization>,
  ) {}

  create(createOrganizationDto: CreateOrganizationDto): Promise<Organization> {
    return this.organizationRepo.save(createOrganizationDto);
  }

  async findAll(params): Promise<Organization[]> {
    return await this.organizationRepo.find();
  }

  async findOne(id: string): Promise<Organization> {
    return await this.organizationRepo.findOne({
      where: { id_organization: +id },
    });
  }

  async update(
    id: string,
    updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<Organization> {
    const toUpdate = await this.organizationRepo.findOne({
      where: { id_organization: +id },
    });
    const updated = Object.assign(toUpdate, updateOrganizationDto);
    return this.organizationRepo.save(updated);
  }

  async remove(id: string): Promise<any> {
    return await this.organizationRepo.delete({ id_organization: +id });
  }
}
