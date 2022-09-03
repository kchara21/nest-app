import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configService } from './config/config.service';
import { OrganizationModule } from './controllers/organization/organization.module';
import { RepositoryModule } from './controllers/repository/repository.module';

@Module({
  imports: [
    OrganizationModule,
    RepositoryModule,
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
