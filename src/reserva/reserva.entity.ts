import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Usuario } from '../usuario/usuario.entity';
import { Cancha } from '../cancha/cancha.entity';
import { EstadoReserva } from '../enums/estado-reserva.enum';

@Entity()
export class Reserva {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fecha: Date;

    @Column({
        type: 'text',
        default: EstadoReserva.PENDIENTE,
    })
    estado: EstadoReserva;

    @CreateDateColumn()
    creadoEn: Date;

    @UpdateDateColumn()
    actualizadoEn: Date;

    @ManyToOne(() => Usuario, (usuario) => usuario.reservas)
    usuario: Usuario;

    @ManyToOne(() => Cancha, (cancha) => cancha.reservas)
    cancha: Cancha;
}
