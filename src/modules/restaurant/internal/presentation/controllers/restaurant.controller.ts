import { Controller, Get, Param, HttpCode, HttpStatus, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { IGetAllRestaurantsHandler } from '../../application/queries/get-all-restaurants/get-all-restaurants.handler';
import { IGetRestaurantByIdHandler } from '../../application/queries/get-restaurant-by-id/get-restaurant-by-id.handler';
import { GetAllRestaurantsQuery } from '../../application/queries/get-all-restaurants/get-all-restaurants.query';
import { GetRestaurantByIdQuery } from '../../application/queries/get-restaurant-by-id/get-restaurant-by-id.query';
import { RestaurantResponseDto } from '../dtos/responses/restaurant.response.dto';
import { RestaurantWithMenuResponseDto } from '../dtos/responses/restaurant-with-menu.response.dto';


@ApiTags('Restaurants')
@Controller('restaurants')
export class RestaurantController {
  constructor(
    @Inject(IGetAllRestaurantsHandler)
    private readonly getAllHandler: IGetAllRestaurantsHandler,
    @Inject(IGetRestaurantByIdHandler)
    private readonly getByIdHandler: IGetRestaurantByIdHandler,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List all restaurants' })
  async getAll(): Promise<RestaurantResponseDto[]> {
    const result = await this.getAllHandler.handle(new GetAllRestaurantsQuery());
    return result.restaurants.map((r) => new RestaurantResponseDto(r));
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a restaurant with its menu items' })
  @ApiParam({ name: 'id', description: 'Restaurant UUID' })
  async getById(@Param('id') id: string): Promise<RestaurantWithMenuResponseDto> {
    const result = await this.getByIdHandler.handle(new GetRestaurantByIdQuery(id));
    return new RestaurantWithMenuResponseDto(result);
  }
}
