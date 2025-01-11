import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Reserva } from '../reserva/reserva.entity';

@Entity()
export class Cancha {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column()
    direccion: string;

    @Column({ nullable: true })
    precioPorHora: number;

    // Relación con reservas
    @OneToMany(() => Reserva, (reserva) => reserva.cancha)
    reservas: Reserva[];
}
