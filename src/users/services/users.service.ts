import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt'
import { UsersEntity } from '../entities/users.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { UserDTO, UserProjectDTO, UserUpdateDTO } from '../dto/user.dto';
import { ErrorManager } from 'src/utils/error.manager';
import { UsersProjectsEntity } from '../entities/usersProjects.entity';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(UsersEntity) private readonly usersRepository: Repository<UsersEntity>,
        @InjectRepository(UsersProjectsEntity) private readonly usersProjectsRepository: Repository<UsersProjectsEntity>
    ){}


   public async createUser(body: UserDTO): Promise<UsersEntity>{
    try {
        body.password = await bcrypt.hash(body.password, +process.env.HASH_SALT)
        return await this.usersRepository.save(body)
    } catch (error) {
        throw ErrorManager.createSignatureError(error.message)
    }
   }

   public async findUsers(): Promise<UsersEntity[]>{
    try {
        const users: UsersEntity[] = await this.usersRepository.find()

        if(users.length === 0){
            throw new ErrorManager({
                type: 'BAD_REQUEST',
                message: 'No se encontro resultado'
            })
        }

        return users
    } catch (error) {
        throw ErrorManager.createSignatureError(error.message)
    }
   }

   public async findBy({ key, value }:{key: keyof UserDTO, value: any}) {
        try {
            const user: UsersEntity = await this.usersRepository
                .createQueryBuilder('user')
                .addSelect('user.password')
                .where({[key]: value})
                .getOne()

            return user
        } catch (error) {
            throw ErrorManager.createSignatureError(error.message)
        }
   }

   public async findUserById(id: string): Promise<UsersEntity>{
    try {
        const user: UsersEntity = await this.usersRepository
            .createQueryBuilder('user')
            .where({id})
            .leftJoinAndSelect('user.projectsIncludes','projectsIncludes')
            .leftJoinAndSelect('projectsIncludes.project','project')
            .getOne()
        if(!user){
            throw new ErrorManager({
                type: 'BAD_REQUEST',
                message: 'No se encontro resultado'
            })
        }

        return user
    } catch (error) {
        throw ErrorManager.createSignatureError(error.message)
    }
   }

   public async updateUser(body: UserUpdateDTO, id: string): Promise<UpdateResult>{
    try {
        const user: UpdateResult = await this.usersRepository.update(id, body)

        if(user.affected === 0) {
            throw new ErrorManager({
                type: 'BAD_REQUEST',
                message: 'No se pudo actualizar'
            })
        }

        return user
       
    } catch (error) {
        throw ErrorManager.createSignatureError(error.message)
    }
   }

   public async deleteUser(id: string): Promise<DeleteResult>{
    try {
        const user: DeleteResult = await this.usersRepository.delete(id)

        if(user.affected === 0) {
            throw new ErrorManager({
                type: 'BAD_REQUEST',
                message: 'No se pudo borrar'
            })
        }

        return user
       
    } catch (error) {
        throw ErrorManager.createSignatureError(error.message)
    }
   }

   public async relationToProject(body: UserProjectDTO) {
    try {
        return await this.usersProjectsRepository.save(body)
    } catch (error) {
        throw ErrorManager.createSignatureError(error.message)
    }
   }
}
