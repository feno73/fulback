import {Body, Get, Controller, Post, Param, Patch} from '@nestjs/common';
import { ReservaService } from './reserva.service';
import { CreateReservaDto } from '../dto/create-reserva.dto';
import { Reserva } from './reserva.entity';
import {UpdateReservaDto} from "../dto/update-reserva.dto";

@Controller('api/v1/reservas')
export class ReservaController {
    constructor(private readonly reservaService: ReservaService) {}

    @Post()
    async createReserva(@Body() createReservaDto: CreateReservaDto): Promise<Reserva> {
        return this.reservaService.createReserva(createReservaDto);
    }

    @Get()
    async getReservas(): Promise<Reserva[]> {
        return this.reservaService.getReservas();
    }

    @Patch(':id')
    async updateReserva(
        @Param('id') id: string,
        @Body() updateReservaDto: UpdateReservaDto,
    ): Promise<Reserva> {
        const reservaId = parseInt(id, 10);
        return this.reservaService.updateReserva(reservaId, updateReservaDto);
    }
}