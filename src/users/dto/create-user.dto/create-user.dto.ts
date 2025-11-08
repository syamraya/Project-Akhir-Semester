import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    password: string; 

    @IsNotEmpty()
    @IsEnum(['USER', 'ADMIN'])
    role: 'USER' | 'ADMIN';
}
