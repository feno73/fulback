import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { DisponibilidadService } from './disponibilidad.service';

@Controller('api/v1/disponibilidad')
export class DisponibilidadController {
  constructor(private readonly disponibilidadService: DisponibilidadService) {}

  @Get()
  async getDisponibilidad(@Query('startDate') startDate: string) {
    if (!startDate) {
      throw new BadRequestException('Falta el parámetro startDate');
    }
    return this.disponibilidadService.getDisponibilidad(startDate);
  }
}
