import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateFieldDto {
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsString()
    @IsNotEmpty()
    direccion: string;

    @IsNumber()
    @IsNotEmpty()
    precioPorHora: number;
}