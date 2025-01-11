import { Controller, Post, Body } from '@nestjs/common';
import { CreateFieldDto } from '../dto/create-field.dto';
import { CanchaService } from './cancha.service';
import { Cancha } from './cancha.entity';

@Controller('api/v1/canchas')
export class CanchaController {
    constructor(private readonly canchaService: CanchaService) {}

    @Post()
    async createField(@Body() createFieldDto: CreateFieldDto): Promise<Cancha> {
        return this.canchaService.createField(createFieldDto);
    }
}