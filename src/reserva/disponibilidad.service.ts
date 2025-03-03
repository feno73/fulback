import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Reserva } from '../reserva/reserva.entity';
import { addDays, format, startOfDay, endOfDay } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

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

    //    const endDate = addDays(startDate, 7);

    // Obtenemos todas las reservas con sus relaciones
    const reservasEnRango = await this.reservaRepository.find({
      where: {
        fecha: Between(startOfDay(startDate), endOfDay(startDate)),
      },
    });
    const formatoFecha = 'yyyy-MM-dd';
    const formatoHora = 'HH:mm';

    console.log('Reservas en rango:', reservasEnRango);
    const reservasSet = new Set<string>();

    for (const reserva of reservasEnRango) {
      const fechaLocal = new Date(reserva.fecha);
      console.log('Fecha local:', fechaLocal, 'Fecha:', reserva.fecha);
      const diaStr = formatInTimeZone(fechaLocal, 'UTC', formatoFecha); // "2025-01-13"
      const horaStr = formatInTimeZone(fechaLocal, 'UTC', formatoHora); // "09:00"

      console.log('Dia y hora:', diaStr, horaStr);
      reservasSet.add(`${diaStr}_${horaStr}`);
    }

    console.log('Set de reservas:', reservasSet);

    // 5. Generar los slots para cada día + hora, y verificar disponibilidad
    const result: any[] = [];

    for (let i = 0; i < 7; i++) {
      const currentDate = addDays(startDate, i);
      const diaStr = format(currentDate, formatoFecha); // "2025-01-13", etc.

      // Slots de 1 hora: 9:00 a 21:00 (último slot = 21:00->22:00)
      for (let hora = 9; hora < 22; hora++) {
        // Construimos "09:00", "10:00", ...
        const horaStr = hora.toString().padStart(2, '0') + ':00';

        const clave = `${diaStr}_${horaStr}`;
        let estaOcupado: boolean;

        const now = new Date();
        // Obtenemos el inicio del día de hoy (00:00)
        const todayStart = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
        );

        if (currentDate < todayStart) {
          // Si currentDate es un día anterior a hoy, se marca como ocupado
          estaOcupado = true;
        } else {
          // Si es hoy o un día futuro, se valida contra el Set
          estaOcupado = reservasSet.has(clave);
        }

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
