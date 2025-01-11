import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Reserva } from '../reserva/reserva.entity';
import { addDays, format, startOfDay, endOfDay } from 'date-fns';

@Injectable()
export class DisponibilidadService {
  constructor(
    @InjectRepository(Reserva)
    private readonly reservaRepository: Repository<Reserva>,
  ) {}

  async getDisponibilidad(startDateStr: string): Promise<any> {
    const startDate = new Date(`${startDateStr}T00:00:00`);
    if (isNaN(startDate.getTime())) {
      throw new Error('La fecha no es válida');
    }

    const endDate = addDays(startDate, 7);

    // Obtenemos todas las reservas con sus relaciones
    const reservasEnRango = await this.reservaRepository.find({
      where: {
        fecha: Between(startOfDay(startDate), endOfDay(endDate)),
      },
    });

    const formatoFecha = 'yyyy-MM-dd';
    const formatoHora = 'HH:mm';

    const reservasSet = new Set<string>();

    for (const reserva of reservasEnRango) {
      const diaStr = format(reserva.fecha, formatoFecha); // "2025-01-13"
      const horaStr = format(reserva.fecha, formatoHora); // "09:00"
      reservasSet.add(`${diaStr}_${horaStr}`);
    }

    // 5. Generar los slots para cada día + hora, y verificar disponibilidad
    const result: any[] = [];

    for (let i = 0; i < 7; i++) {
      const currentDate = addDays(startDate, i);
      const diaStr = format(currentDate, formatoFecha); // "2025-01-13", etc.

      // Slots de 1 hora: 9:00 a 21:00 (último slot = 21:00->22:00)
      for (let hora = 9; hora < 22; hora++) {
        // Construimos "09:00", "10:00", ...
        const horaStr = hora.toString().padStart(2, '0') + ':00';

        // Chequeamos en el Set
        const clave = `${diaStr}_${horaStr}`;
        const estaOcupado = reservasSet.has(clave);

        result.push({
          day: diaStr,
          time: horaStr,
          available: !estaOcupado,
        });
      }
    }

    // 6. Retornar en el formato requerido
    return {
      data: result,
    };
  }
}
