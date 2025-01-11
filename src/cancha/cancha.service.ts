import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFieldDto } from '../dto/create-field.dto';
import { Cancha } from './cancha.entity';

@Injectable()
export class CanchaService {
    constructor(
        @InjectRepository(Cancha)
        private readonly canchaRepository: Repository<Cancha>,
        ) {}

    async createField(createFieldDto: CreateFieldDto): Promise<Cancha> {
        const { nombre, direccion, precioPorHora } = createFieldDto;

        // Creamos la cancha
        const nuevaCancha = this.canchaRepository.create({
            nombre,
            direccion,
            precioPorHora,
        });

        // Guardamos en la base de datos
        return this.canchaRepository.save(nuevaCancha);
    }
}