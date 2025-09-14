import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BikesStatusFilterDto } from '../dto/bikesStatusFilter.dto';
import { BikesService } from '../services/bikes.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateBikeRequestBodyDto } from '../dto/createBike.dto';
import { UpdateBikeDto } from '../dto/updateBike.dto';
import {
  JwtUser,
  OptionalJwtGuard,
} from 'src/modules/auth/guards/optional-jwt/optional-jwt.guard';
import { ListingStatus } from '@prisma/client';

@ApiTags('Bikes')
@Controller('bikes')
export class BikesController {
  constructor(private readonly bikesService: BikesService) {}

  @Get('active')
  @ApiOperation({ summary: 'List all active bikes' })
  getAllActive() {
    return this.bikesService.findAllByStatus(ListingStatus.ACTIVE);
  }

  @Get('sold')
  @ApiOperation({ summary: 'List all sold bikes' })
  getAllSold() {
    return this.bikesService.findAllByStatus(ListingStatus.SOLD);
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
  @Patch(':id')
  @ApiOperation({ summary: 'Update your own bike listing' })
  updateMyBike(
    @Param('id') bikeId: string,
    @Body() updateBikeDto: UpdateBikeDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.bikesService.updateMyBike(user.id, bikeId, updateBikeDto);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(OptionalJwtGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Show single bike' })
  getOneBike(@Param('id') bikeId: string, @CurrentUser() user: JwtUser) {
    return this.bikesService.getOneBike(bikeId, user.id);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  @ApiOperation({ summary: 'Like a bike' })
  likeBike(@Param('id') bikeId: string, @CurrentUser() user: { id: string }) {
    return this.bikesService.likeBike(bikeId, user.id);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Delete(':id/like')
  @ApiOperation({ summary: 'Unlike a bike' })
  unlikeBike(@Param('id') bikeId: string, @CurrentUser() user: { id: string }) {
    return this.bikesService.unlikeBike(bikeId, user.id);
  }
}
