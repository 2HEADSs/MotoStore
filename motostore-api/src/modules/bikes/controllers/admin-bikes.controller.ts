import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { AdminBikesService } from '../services/admin-bikes.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { AdminGuard } from 'src/modules/auth/guards/admin.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminUpdateBikeDto } from '../dto/adminUpdateBike.dto';

@ApiTags('AdminBikes')
@ApiBearerAuth('access-token')
@Controller('admin/bikes')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminBikesController {
  constructor(private readonly adminBikesService: AdminBikesService) {}

  @Get('all')
  @ApiOperation({ summary: 'List all active/sold bikes' })
  getAll() {
    return this.adminBikesService.findAll();
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Admin: update any bike listing' })
  @ApiBody({ type: AdminUpdateBikeDto })
  updateBike(@Param('id') bikeId: string, @Body() dto: AdminUpdateBikeDto) {
    return this.adminBikesService.updateBike(bikeId, dto);
  }
}
