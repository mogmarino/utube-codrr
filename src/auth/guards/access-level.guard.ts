import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ACCESS_LEVEL_KEY, ADMIN_KEY, PUBLIC_KEY, ROLES_KEY } from 'src/constants/key-decorator';
import { ROLES, ACCESS_LEVEL } from 'src/constants/roles';
import { UsersService } from 'src/users/services/users.service';

@Injectable()
export class AccessLevelGuard implements CanActivate {
  constructor(
    private readonly userService: UsersService,
    private readonly reflector: Reflector
  ){}
  async canActivate(
    context: ExecutionContext,
  ) {

    const isPublic = this.reflector.get<boolean>(
      PUBLIC_KEY,
      context.getHandler()
    )

    if(isPublic){
      return true
    }

    const roles = this.reflector.get<Array<keyof typeof ROLES>>(
      ROLES_KEY,
      context.getHandler()
    )

    const accessLevel = this.reflector.get<keyof typeof ACCESS_LEVEL>(
      ACCESS_LEVEL_KEY,
      context.getHandler()
    )


    const admin = this.reflector.get<string>(
      ADMIN_KEY,
      context.getHandler()
    )

    
    const req = context.switchToHttp().getRequest<Request>()

    const { roleUser, idUser } = req

    if(accessLevel === undefined){
      if(roles === undefined){
        if(!admin){
          return true
        }else if(admin && roleUser === admin){
          return true
        }else {
          throw new UnauthorizedException('No tiene acceso')
        }
      }
    }
   

    if(roleUser === ROLES.ADMIN || roleUser === ROLES.CREATOR){
      return true
    }

    const user = await this.userService.findUserById(idUser)

    const userExistInProject = user.projectsIncludes.find(project => project.project.id === req.params.projectId )

    if(userExistInProject === undefined ){
      throw new UnauthorizedException('No perteneces al proyecto')
    }

    if (ACCESS_LEVEL[accessLevel] > userExistInProject.accessLevel) {
      throw new UnauthorizedException('No tienes el nivel de acceso necesario');
    }
    return true;
  }
}
