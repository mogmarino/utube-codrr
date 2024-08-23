import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthBody } from '../interfaces/auth.interface';
import { ErrorManager } from 'src/utils/error.manager';
import { AuthDTO } from '../dto/auth.dto';
import { AuthGuard } from '../guards/auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService
    ){}

    @Post('login')
    async login(@Body() {username, password}: AuthDTO) {
        const userValidate = await this.authService.validateUser(username,password)


        if(!userValidate){
            throw new ErrorManager({
                type: 'BAD_REQUEST',
                message: 'El usuario no pudo ser validado'
            })
        }

        const jwt = await this.authService.generateJWT(userValidate)

        return jwt
    }
}
