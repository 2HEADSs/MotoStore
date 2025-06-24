import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateBikeRequestBodyDto } from '../dto/bikes.dto';
import { BikesService } from '../services/bikes.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { AdminGuard } from 'src/modules/auth/guards/admin.guard';

@Controller('bikes')
export class BikesController {
  constructor(private readonly bikesService: BikesService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  create(
    @Body() createBikeRequestBodyDto: CreateBikeRequestBodyDto,
    @CurrentUser() user: { id: string; email: string; role: string },
  ) {
    return this.bikesService.createBike(user.id, createBikeRequestBodyDto);
  }

  @Get('all')
  getAll() {
    return this.bikesService.findAll();
  }
}
