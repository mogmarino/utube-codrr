import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Put, UseGuards } from '@nestjs/common';
import { ProjectsService } from '../services/projects.service';
import { ProjectDTO, ProjectUpdateDTO } from '../dto/project.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AccessLevelGuard } from 'src/auth/guards/access-level.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { AccessLevel } from 'src/auth/decorators/access-level.decorator';
import { PublicAccess } from 'src/auth/decorators/public.decorator';

@ApiTags('Projects')
@Controller('projects')
@UseGuards(AuthGuard, RolesGuard, AccessLevelGuard)
export class ProjectsController {

    constructor(
        private readonly projectsService: ProjectsService
    ){}


    @ApiParam({
        name: 'userId'
    })
    @Roles('CREATOR')
    @Post('create/userOwner/:userId')
    public async createProject(
        @Body() body: ProjectDTO,
        @Param('userId') userId: string,
    ) {
        return await this.projectsService.createProject(body, userId);
    }

    @Get('all')
    public async findAllProjects() {
        return await this.projectsService.findProjects()
    }

    @PublicAccess()
    @Get('list/api')
    public async listApi(){
        return this.projectsService.listApi()
    }

    @ApiParam({
        name: 'projectId'
    })
    @Get(':projectId')
    public async findProjectById(
        @Param('projectId', new ParseUUIDPipe()) id: string,
    ) {
        return await this.projectsService.findProjectById(id);
    }

    @ApiParam({
        name: 'projectId'
    })
    @AccessLevel('OWNER')
    @Put('edit/:projectId')
    public async updateProject(
      @Param('projectId', new ParseUUIDPipe()) id: string,
      @Body() body: ProjectUpdateDTO,
    ) {
      return await this.projectsService.updateProject(body, id);
    }


}
