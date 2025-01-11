import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuarioService {
    constructor(
        @InjectRepository(Usuario)
        private readonly usuarioRepository: Repository<Usuario>,
    ) {}

    async createUser(createUserDto: CreateUserDto): Promise<Usuario> {
        const { nombre, apellido, telefono,email, password } = createUserDto;

        // Hasheamos la contraseña
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Creamos el usuario
        const nuevoUsuario = this.usuarioRepository.create({
            nombre,
            apellido,
            telefono,
            email,
            password: hashedPassword,
        });

        // Guardamos en la base de datos
        return this.usuarioRepository.save(nuevoUsuario);
    }

    // ... otros métodos (p.ej. buscar por email, actualizar, etc.)
}
