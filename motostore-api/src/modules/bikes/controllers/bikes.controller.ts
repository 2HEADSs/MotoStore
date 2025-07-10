import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { BikeStatusFilterDto, MyBikesStatusFilterDto } from '../dto/bikesStatusFileter.dto';
import { BikesService } from '../services/bikes.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateBikeRequestBodyDto } from '../dto/createBike.dto';

@Controller('bikes')
export class BikesController {
  constructor(private readonly bikesService: BikesService) {}

  @ApiBearerAuth('access-token')
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

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('findMyBikes')
  findMyBikes(
    @CurrentUser() user: { id: string; email: string; role: string },
    @Query() filter: MyBikesStatusFilterDto,
  ) {
    return this.bikesService.findMyBikes(user.id, filter.status);
  }
}
