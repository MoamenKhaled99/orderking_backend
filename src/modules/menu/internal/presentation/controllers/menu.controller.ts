import { Controller, Get, Param, HttpCode, HttpStatus, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import {
  IGetMenuItemByIdHandler,
} from '../../application/queries/get-menu-item-by-id/get-menu-item-by-id.handler';
import {
  IGetMenuByRestaurantHandler,
} from '../../application/queries/get-menu-by-restaurant/get-menu-by-restaurant.handler';
import { GetMenuItemByIdQuery } from '../../application/queries/get-menu-item-by-id/get-menu-item-by-id.query';
import { GetMenuByRestaurantQuery } from '../../application/queries/get-menu-by-restaurant/get-menu-by-restaurant.query';
import { MenuItemResponseDto } from '../dtos/responses/menu-item.response.dto';

@ApiTags('Menu')
@Controller('menu')
export class MenuController {
  constructor(
    @Inject(IGetMenuItemByIdHandler)
    private readonly getMenuItemByIdHandler: IGetMenuItemByIdHandler,
    @Inject(IGetMenuByRestaurantHandler)
    private readonly getMenuByRestaurantHandler: IGetMenuByRestaurantHandler,
  ) {}

  // Declared BEFORE /:restaurantId to prevent NestJS matching "item" as a restaurantId
  @Get('item/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a single menu item by ID' })
  @ApiParam({ name: 'id', description: 'Menu item UUID' })
  async getMenuItemById(@Param('id') id: string): Promise<MenuItemResponseDto> {
    const result = await this.getMenuItemByIdHandler.handle(new GetMenuItemByIdQuery(id));
    return new MenuItemResponseDto(result);
  }

  @Get(':restaurantId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List all available menu items for a restaurant' })
  @ApiParam({ name: 'restaurantId', description: 'Restaurant UUID' })
  async getMenuByRestaurant(
    @Param('restaurantId') restaurantId: string,
  ): Promise<MenuItemResponseDto[]> {
    const result = await this.getMenuByRestaurantHandler.handle(
      new GetMenuByRestaurantQuery(restaurantId),
    );
    return result.items.map((item) => new MenuItemResponseDto(item));
  }
}
