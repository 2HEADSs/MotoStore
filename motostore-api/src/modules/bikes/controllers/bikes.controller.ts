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
import { BikesService } from '../services/bikes.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateBikeRequestBodyDto } from '../dto/createBike.dto';
import { UpdateBikeDto } from '../dto/updateBike.dto';
import {
  JwtUser,
  OptionalJwtGuard,
} from 'src/modules/auth/guards/optional-jwt/optional-jwt.guard';
import { ListingStatus } from '@prisma/client';
import { BikeResponseDto } from '../dto/BikeResponseDto.dto';

@ApiTags('Bikes')
@Controller('bikes')
export class BikesController {
  constructor(private readonly bikesService: BikesService) {}

  @Get('active')
  @ApiOperation({ summary: 'List all active bikes' })
  @ApiOkResponse({ type: BikeResponseDto, isArray: true })
  getAllActive() {
    return this.bikesService.findAllByStatus(ListingStatus.ACTIVE);
  }

  @Get('sold')
  @ApiOperation({ summary: 'List all sold bikes' })
  @ApiOkResponse({ type: BikeResponseDto, isArray: true })
  getAllSold() {
    return this.bikesService.findAllByStatus(ListingStatus.SOLD);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post('create')
  @ApiOperation({ summary: 'Create a new bike listing' })
  @ApiOkResponse({ type: BikeResponseDto })
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
  @ApiOkResponse({ type: BikeResponseDto })
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
  @ApiOkResponse({ type: BikeResponseDto })
  getOneBike(@Param('id') bikeId: string, @CurrentUser() user: JwtUser) {
    return this.bikesService.getOneBike(bikeId, user.id);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  @ApiOperation({ summary: 'Like a bike' })
  @ApiOkResponse({ type: BikeResponseDto })
  likeBike(@Param('id') bikeId: string, @CurrentUser() user: { id: string }) {
    return this.bikesService.likeBike(bikeId, user.id);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Delete(':id/like')
  @ApiOperation({ summary: 'Unlike a bike' })
  @ApiOkResponse({ type: BikeResponseDto })
  unlikeBike(@Param('id') bikeId: string, @CurrentUser() user: { id: string }) {
    return this.bikesService.unlikeBike(bikeId, user.id);
  }
}
