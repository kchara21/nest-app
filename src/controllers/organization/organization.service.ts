import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { Organization } from './entities/organization.entity';

@Injectable()
export class OrganizationService {
  private readonly logger = new Logger(OrganizationService.name);
  constructor(
    @InjectRepository(Organization)
    private organizationRepo: Repository<Organization>,
  ) {}

  async create(organization: CreateOrganizationDto) {
    const organizationExist = await this.organizationRepo.findOne({
      where: { name: organization.name, status: 1 },
    });
    if (organizationExist) {
      this.logger.debug(`La organizacion ${organization.name} ya existe`);
      throw new ConflictException(
        `La organizacion ${organization.name} ya existe`,
      );
    }
    return this.organizationRepo.save(organization);
  }

  async findAll(params): Promise<Organization[]> {
    const repositories = await this.organizationRepo.find();
    if (repositories.length < 1) {
      this.logger.debug('No se encontraron organizaciones');
      throw new NotFoundException('No se encontraron organizaciones');
    }
    return repositories;
  }

  async findOne(id: string): Promise<Organization> {
    const organization = await this.organizationRepo.findOne({
      where: { id_organization: +id, status: 1 },
    });
    if (!organization) {
      this.logger.debug('La organizacion no existe');
      throw new NotFoundException('La organizacion no existe');
    }
    return organization;
  }

  async update(
    id: string,
    updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<Organization> {
    const toUpdate = await this.findOne(id);
    if (!toUpdate) {
      this.logger.debug('La organizacion a editar no existe');
      throw new NotFoundException('La organizacion a editar no existe');
    }

    const organizationExist = await this.organizationRepo.findOne({
      where: { name: updateOrganizationDto.name, status: 1 },
    });

    if (organizationExist) {
      this.logger.debug('La organizacion ya existe');
      throw new ConflictException('La organizacion ya existe');
    }

    const updated = Object.assign(toUpdate, updateOrganizationDto);
    return this.organizationRepo.save(updated);
  }

  async remove(id: string): Promise<any> {
    return await this.organizationRepo.delete({ id_organization: +id });
  }
}
