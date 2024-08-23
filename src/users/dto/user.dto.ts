import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";
import { ACCESS_LEVEL, ROLES } from "src/constants/roles";
import { UsersEntity } from "../entities/users.entity";
import { ProjectDTO } from "src/projects/dto/project.dto";
import { ApiProperty } from "@nestjs/swagger";


export class UserDTO {

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    firstName: string;
    
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    lastName: string;
    
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    age: number;
    
    @IsNotEmpty()
    @ApiProperty()
    @IsString()
    email: string;
    
    @IsNotEmpty()
    @ApiProperty()
    @IsString()
    username: string;
    
    @IsNotEmpty()
    @ApiProperty()
    @IsString()
    password: string;
    
    @IsNotEmpty()
    @ApiProperty()
    @IsEnum(ROLES)
    role: ROLES;
}

export class UserUpdateDTO {
    
    @ApiProperty()
    @IsOptional()
    @IsString()
    firstName: string;
    
    @ApiProperty()
    @IsOptional()
    @IsString()
    lastName: string;
    
    @ApiProperty()
    @IsOptional()
    @IsNumber()
    age: number;
    
    @ApiProperty()
    @IsOptional()
    @IsString()
    email: string;
    
    @ApiProperty()
    @IsOptional()
    @IsString()
    username: string;
    
    @ApiProperty()
    @IsOptional()
    @IsString()
    password: string;
    
    @ApiProperty()
    @IsOptional()
    @IsEnum(ROLES)
    role: ROLES;
}

export class UserProjectDTO {
    
    @ApiProperty()
    @IsNotEmpty()
    @IsUUID()
    user: UsersEntity
    
    @ApiProperty()
    @IsNotEmpty()
    @IsUUID()
    project: ProjectDTO
    
    @ApiProperty()
    @IsNotEmpty()
    @IsEnum(ACCESS_LEVEL)
    accessLevel: ACCESS_LEVEL
    
}