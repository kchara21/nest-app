import { Controller } from '@nestjs/common';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

@Controller('organization')
export class CreateOrganizationDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  readonly name: string;
}
