import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cancha } from './cancha/cancha.entity';
import { Usuario } from './usuario/usuario.entity';
import { Reserva } from './reserva/reserva.entity';
import { UsuarioModule } from './usuario/usuario.module';
import { CanchaModule } from './cancha/cancha.module';
import { ReservaModule } from './reserva/reserva.module';
import { DisponibilidadModule } from './reserva/disponibilidad.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [Cancha, Usuario, Reserva],
      synchronize: true, // ¡Sólo en desarrollo! En producción evita usar `synchronize: true`.
    }),
    CanchaModule,
    UsuarioModule,
    ReservaModule,
    DisponibilidadModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
