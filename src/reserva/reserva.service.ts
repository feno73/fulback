import {ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reserva } from './reserva.entity';
import { CreateReservaDto } from '../dto/create-reserva.dto';
import { Usuario } from '../usuario/usuario.entity';
import { Cancha } from '../cancha/cancha.entity';
import { EstadoReserva } from '../enums/estado-reserva.enum';
import {UpdateReservaDto} from "../dto/update-reserva.dto";

@Injectable()
export class ReservaService {
    constructor(
        @InjectRepository(Reserva)
        private readonly reservaRepository: Repository<Reserva>,
        @InjectRepository(Usuario)
        private readonly usuarioRepository: Repository<Usuario>,
        @InjectRepository(Cancha)
        private readonly canchaRepository: Repository<Cancha>,
    ) {}

    private async validarFechaReserva(fecha: Date, canchaId: number): Promise<void> {
        const reservaExistente = await this.reservaRepository.findOne({
            where: {
                fecha,
                cancha: { id: canchaId },
            },
            relations: ['cancha'],
        });

        if (reservaExistente) {
            throw new ConflictException(
                `La cancha con id ${canchaId} ya está reservada para la fecha/hora: ${fecha}`,
            );
        }
    }
    /**
     * Crea una nueva reserva
     * @param createReservaDto Contiene los datos necesarios para la reserva
     * @returns La reserva creada
     */

    async createReserva(createReservaDto: CreateReservaDto): Promise<Reserva> {
        const { usuarioId, canchaId, fecha } = createReservaDto;

        // Obtenemos los usuario y cancha
        const usuario = await this.usuarioRepository.findOne({
            where: {id: usuarioId},
        });
        if (!usuario) {
            throw new NotFoundException('Usuario no encontrado');
        }

        const cancha = await this.canchaRepository.findOne({
            where: {id: canchaId},
        });
        if (!cancha) {
            throw new NotFoundException('Cancha no encontrada');
        }

        const fechaFormateada = new Date(fecha);

        await this.validarFechaReserva(fechaFormateada, canchaId);

        // Creamos la reserva
        const nuevaReserva = this.reservaRepository.create({
            usuario,
            cancha,
            fecha: fechaFormateada,
            estado: EstadoReserva.PENDIENTE,
        });

        // Guardamos en la base de datos
        return this.reservaRepository.save(nuevaReserva);
    }

    async getReservas(): Promise<Reserva[]> {
        // Obtenemos todas las reservas con sus relaciones
        const reservas = await this.reservaRepository.find({
            relations: ['usuario', 'cancha'],
        });

        return reservas;
    }

    /**
     * Actualiza una reserva por su ID.
     * @param id ID de la reserva a actualizar.
     * @param updateReservaDto Datos a actualizar.
     * @returns La reserva actualizada.
     */
    async updateReserva(id: number, updateReservaDto: UpdateReservaDto): Promise<Reserva> {
        // 1. Buscar la reserva
        const reserva = await this.reservaRepository.findOne({
            where: { id },
            relations: ['usuario', 'cancha'], // si necesitas usuario/cancha
        });
        if (!reserva) {
            throw new NotFoundException(`Reserva con ID ${id} no encontrada`);
        }

        // Validar conflicto de fechas
        const { fecha } = updateReservaDto;
        const fechaFormateada = new Date(fecha);
        await this.validarFechaReserva(fechaFormateada, reserva.cancha.id);

        // 2. Aplicar cambios que vengan en updateReservaDto
        // Por ejemplo, si llega fecha, actualiza; si llega estado, actualiza, etc.
        // Puedes hacer esto campo por campo o usando Object.assign():
        Object.assign(reserva, updateReservaDto);

        // 3. Guardar los cambios en la BD
        return this.reservaRepository.save(reserva);
    }
}
