import { Body, Controller, Post } from '@nestjs/common';
import { CreateBikeRequestBodyDto } from '../dto/bikes.dto';
import { BikesService } from '../services/bikes.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller('bikes')
export class BikesController {
  constructor(private readonly bikesService: BikesService) {}

  @Post()
  create(
    @Body() createBikeRequestBodyDto: CreateBikeRequestBodyDto,
    @CurrentUser() user: { id: string; email: string },
  ) {
    return this.bikesService.createBike(user.id, createBikeRequestBodyDto);
  }
}
