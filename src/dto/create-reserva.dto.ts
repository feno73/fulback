import { IsNotEmpty, IsNumber, IsDateString } from 'class-validator';

export class CreateReservaDto {
  @IsNumber()
  @IsNotEmpty()
  usuarioId: number;

  @IsNumber()
  @IsNotEmpty()
  canchaId: number;

  @IsNotEmpty()
  @IsDateString()
  fecha: Date;
}
