import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reserva } from './reserva.entity';
import { ReservaService } from './reserva.service';
import { ReservaController } from './reserva.controller';

import { Usuario } from '../usuario/usuario.entity';
import { Cancha } from "../cancha/cancha.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Reserva, Usuario, Cancha])],
    controllers: [ReservaController],
    providers: [ReservaService],
    exports: [ReservaService],
})
export class ReservaModule {}