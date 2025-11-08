import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, Put, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport'   ;
import { RoleGuard } from 'src/helper/roles-guards';
import { Roles } from 'src/helper/roles-guards';
 
@Controller('users')
export class UsersController {   
constructor(private readonly usersService : UsersService) {}

    @Post()
    @UsePipes(new ValidationPipe())
    create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

    @Get()
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Roles('ADMIN')
    findAll(){
        return this.usersService.findAll();  
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto : UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string){
        return this.usersService.remove(+id);
    }
}