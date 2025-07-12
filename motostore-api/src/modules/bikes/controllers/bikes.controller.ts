import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  BikeStatusFilterDto,
  MyBikesStatusFilterDto,
} from '../dto/bikesStatusFileter.dto';
import { BikesService } from '../services/bikes.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateBikeRequestBodyDto } from '../dto/createBike.dto';
import { UpdateBikeDto } from '../dto/updateBike.dto';

@ApiTags('Bikes')
@Controller('bikes')
export class BikesController {
  constructor(private readonly bikesService: BikesService) {}

  @Get('all')
  @ApiOperation({ summary: 'List all active/sold bikes' })
  getAll(@Query() filter: BikeStatusFilterDto) {
    return this.bikesService.findAll(filter.status);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post('create')
  @ApiOperation({ summary: 'Create a new bike listing' })
  create(
    @Body() createBikeRequestBodyDto: CreateBikeRequestBodyDto,
    @CurrentUser() user: { id: string; email: string; role: string },
  ) {
    return this.bikesService.createBike(user.id, createBikeRequestBodyDto);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('findMyBikes')
  @ApiOperation({ summary: 'List my bikes, optionally filtered by status' })
  findMyBikes(
    @CurrentUser() user: { id: string; email: string; role: string },
    @Query() filter: MyBikesStatusFilterDto,
  ) {
    return this.bikesService.findMyBikes(user.id, filter.status);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update your own bike listing' })
  updateMyBike(
    @Param('id') bikeId: string,
    @Body() updateBikeDto: UpdateBikeDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.bikesService.updateMyBike(user.id, bikeId, updateBikeDto);
  }
}
