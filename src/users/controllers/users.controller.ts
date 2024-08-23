import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { UserDTO, UserProjectDTO, UserUpdateDTO } from '../dto/user.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { PublicAccess } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AdminAccess } from 'src/auth/decorators/admin.decorator';
import { ApiHeader, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
@UseGuards(AuthGuard, RolesGuard)
export class UsersController {

    constructor(private readonly usersService: UsersService){}

    @Post('register')
    public async reisterUser(@Body() body: UserDTO){
        return await this.usersService.createUser(body)
    }

    @ApiHeader({
        name: 'codrr_token'
    })
    @AdminAccess()
    @Get('all')
    public async findAllUsers(){
        return await this.usersService.findUsers()
    }

    @ApiParam({
        name: 'id'
    })
    @Get(':id')
    @PublicAccess()
    public async findUserById(@Param('id') id:string){
        return await this.usersService.findUserById(id)
    }

    @Post('add-to-project')
    public async addToProject(@Body() body: UserProjectDTO){
        return await this.usersService.relationToProject(body)
    }

    @ApiParam({
        name: 'id'
    })
    @Put('edit/:id')
    public async updateUser(@Param('id') id:string, @Body() updateBody: UserUpdateDTO){
        return this.usersService.updateUser(updateBody, id)
    }

    @ApiParam({
        name: 'id'
    })
    @Delete('delete/:id')
    public async deleteUser(@Param('id') id: string){
        return await this.usersService.deleteUser(id)
    }
}
