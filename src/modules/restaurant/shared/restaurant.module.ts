import { Module } from '@nestjs/common';
import { IRestaurantRepository } from '../internal/domain/repositories/restaurant.repo.interface';
import { RestaurantRepository } from '../internal/infrastructure/database/repositories/restaurant.repository';
import {
  GetAllRestaurantsHandler,
  IGetAllRestaurantsHandler,
} from '../internal/application/queries/get-all-restaurants/get-all-restaurants.handler';
import {
  GetRestaurantByIdHandler,
  IGetRestaurantByIdHandler,
} from '../internal/application/queries/get-restaurant-by-id/get-restaurant-by-id.handler';
import { RestaurantController } from '../internal/presentation/controllers/restaurant.controller';

@Module({
  providers: [
    { provide: IRestaurantRepository, useClass: RestaurantRepository },
    { provide: IGetAllRestaurantsHandler, useClass: GetAllRestaurantsHandler },
    { provide: IGetRestaurantByIdHandler, useClass: GetRestaurantByIdHandler },
    RestaurantRepository,
    GetAllRestaurantsHandler,
    GetRestaurantByIdHandler,
  ],
  controllers: [RestaurantController],
})
export class RestaurantModule {}
