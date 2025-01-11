import { Body, Controller, Post } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { Usuario } from './usuario.entity';

@Controller('api/v1/usuarios')
export class UsuarioController {
    constructor(private readonly usuarioService: UsuarioService) {}

    @Post()
    async registerUser(@Body() createUserDto: CreateUserDto): Promise<Usuario> {
        return this.usuarioService.createUser(createUserDto);
    }
}
