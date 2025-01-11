import {IsOptional, IsNumber, IsEnum, IsDateString} from 'class-validator';
import { EstadoReserva } from '../enums/estado-reserva.enum';

export class UpdateReservaDto {
    @IsNumber()
    @IsOptional()
    usuarioId: number;

    @IsNumber()
    @IsOptional()
    canchaId: number;

    @IsOptional()
    @IsDateString()
    fecha: Date;

    @IsOptional()
    @IsEnum(EstadoReserva)
    estado?: EstadoReserva;
}