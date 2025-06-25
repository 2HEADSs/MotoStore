import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import {
  BikeStatusFilterDto,
  CreateBikeRequestBodyDto,
} from '../dto/bikes.dto';
import { BikesService } from '../services/bikes.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { ListingStatus } from '@prisma/client';

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
  getAll(@Query() filter: BikeStatusFilterDto) {
    return this.bikesService.findAll(filter.status);
  }

  @Get('findMyBikes')
  @UseGuards(JwtAuthGuard)
  findMyBikes(
    @CurrentUser() user: { id: string; email: string; role: string },
    @Query('status') status?: ListingStatus,
  ) {
    return this.bikesService.findMyBikes(user.id, status);
  }
}
