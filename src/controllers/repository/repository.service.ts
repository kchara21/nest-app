import { Injectable } from '@nestjs/common';
import { CreateRepositoryDto } from './dto/create-repository.dto';
import { UpdateRepositoryDto } from './dto/update-repository.dto';

@Injectable()
export class RepositoryService {
  findOne(id: number) {
    return `This action returns a #${id} repository`;
  }
}
