import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { TasksService } from '../services/tasks.service';
import { TasksDTO } from '../dto/task.dto';
import { TasksEntity } from '../entities/tasks.entity';
import { ProjectDTO } from 'src/projects/dto/project.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AccessLevelGuard } from 'src/auth/guards/access-level.guard';
import { AccessLevel } from 'src/auth/decorators/access-level.decorator';
import { ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('Tasks')
@Controller('tasks')
@UseGuards(AuthGuard,RolesGuard,AccessLevelGuard)
export class TasksController {

    constructor(
        private readonly taskService: TasksService
    ) {}

    @ApiParam({
        name: 'projectId'
    })
    @AccessLevel('DEVELOPER')
    @Post('create/:projectId')
    public async createTask(@Body() body: TasksDTO,@Param('projectId') id: string): Promise<TasksEntity> {
        return await this.taskService.createTask(body,id)
    }
}
