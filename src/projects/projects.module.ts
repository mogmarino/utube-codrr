import { Module } from '@nestjs/common';
import { ProjectsController } from './controllers/projects.controller';
import { ProjectsService } from './services/projects.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsEntity } from './entities/projects.entity';
import { UsersProjectsEntity } from 'src/users/entities/usersProjects.entity';
import { UsersService } from 'src/users/services/users.service';
import { ProvidersModule } from 'src/providers/providers.module';
import { HttpCustomService } from 'src/providers/http/http.service';

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService, UsersService,HttpCustomService],
  imports: [
    TypeOrmModule.forFeature([
      ProjectsEntity,
      UsersProjectsEntity
    ]),
    ProvidersModule
  ]
})
export class ProjectsModule {}
