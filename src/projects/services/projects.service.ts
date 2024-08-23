import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Injectable, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectsEntity } from '../entities/projects.entity';
import { ProjectDTO, ProjectUpdateDTO } from '../dto/project.dto';
import { ErrorManager } from 'src/utils/error.manager';
import { ACCESS_LEVEL } from 'src/constants/roles';
import { UsersProjectsEntity } from 'src/users/entities/usersProjects.entity';
import { UsersService } from 'src/users/services/users.service';
import { HttpCustomService } from 'src/providers/http/http.service';

@Injectable()
export class ProjectsService {

    constructor(
        @InjectRepository(ProjectsEntity) private readonly projectsRepository: Repository<ProjectsEntity>,
        @InjectRepository(UsersProjectsEntity) private readonly userProjectRepository: Repository<UsersProjectsEntity>,
        private readonly usersService: UsersService,
        private readonly httpService: HttpCustomService
    ){}

    public async createProject(body: ProjectDTO, userId: string): Promise<any> {
        try {
          const user = await this.usersService.findUserById(userId)
          const project = await this.projectsRepository.save(body);
          return await this.userProjectRepository.save({
            accessLevel: ACCESS_LEVEL.OWNER,
            user: user,
            project
          })
        } catch (error) {
          throw ErrorManager.createSignatureError(error.message);
        }
    }

    public async listApi() {
      return this.httpService.apiFindAll()
    }

    public async findProjects(): Promise<ProjectsEntity[]>{
        try {
            const projects: ProjectsEntity[] = await this.projectsRepository.find()

            if(projects.length === 0){
                throw new ErrorManager({
                    type: 'BAD_REQUEST',
                    message: 'No se encontro ningún proyecto'
                })
            }
    
            return projects
        } catch (error) {
            throw ErrorManager.createSignatureError(error.message)
        }
    }

    public async findProjectById(id: string): Promise<ProjectsEntity>{
        try {
            const project = await this.projectsRepository
                .createQueryBuilder('project')
                .where({id})
                .leftJoinAndSelect('project.usersIncludes','usersIncludes')
                .leftJoinAndSelect('usersIncludes.user','user')
                .getOne()

            if(!project){
                throw new ErrorManager({
                    type: 'BAD_REQUEST',
                    message: `No existe un proyecto con el id ${id}`
                })
            }

            return project
        } catch (error) {
            throw ErrorManager.createSignatureError(error.message)
        }
    }

    public async updateProject(
        body: ProjectUpdateDTO,
        id: string,
      ): Promise<UpdateResult | undefined> {
        try {
          const project: UpdateResult = await this.projectsRepository.update(
            id,
            body,
          );
          if (project.affected === 0) {
            throw new ErrorManager({
              type: 'BAD_REQUEST',
              message: 'No se pudo actualizar proyecto',
            });
          }
          return project;
        } catch (error) {
          throw ErrorManager.createSignatureError(error.message);
        }
    }

    public async deleteProject(id: string): Promise<DeleteResult | undefined> {
        try {
          const project: DeleteResult = await this.projectsRepository.delete(id);
          if (project.affected === 0) {
            throw new ErrorManager({
              type: 'BAD_REQUEST',
              message: 'No se pudo borrar proyecto',
            });
          }
          return project;
        } catch (error) {
          throw ErrorManager.createSignatureError(error.message);
        }
    }
}
