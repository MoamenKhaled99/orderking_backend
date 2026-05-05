import { Module } from '@nestjs/common';
import { IMenuRepository } from '../internal/domain/repositories/menu.repo.interface';
import { MenuRepository } from '../internal/infrastructure/database/repositories/menu.repository';
import {
  GetMenuByRestaurantHandler,
  IGetMenuByRestaurantHandler,
} from '../internal/application/queries/get-menu-by-restaurant/get-menu-by-restaurant.handler';
import {
  GetMenuItemByIdHandler,
  IGetMenuItemByIdHandler,
} from '../internal/application/queries/get-menu-item-by-id/get-menu-item-by-id.handler';
import { MenuController } from '../internal/presentation/controllers/menu.controller';

@Module({
  providers: [
    { provide: IMenuRepository, useClass: MenuRepository },
    { provide: IGetMenuByRestaurantHandler, useClass: GetMenuByRestaurantHandler },
    { provide: IGetMenuItemByIdHandler, useClass: GetMenuItemByIdHandler },
    MenuRepository,
    GetMenuByRestaurantHandler,
    GetMenuItemByIdHandler,
  ],
  controllers: [MenuController],
})
export class MenuModule {}
