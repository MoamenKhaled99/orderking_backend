import { Inject, Injectable } from '@nestjs/common';
import { IQueryHandler } from '../../../../../../shared/application/query.handler.interface';
import { IRestaurantRepository } from '../../../domain/repositories/restaurant.repo.interface';
import { RestaurantNotFoundError } from '../../errors/restaurant-not-found.error';
import { GetRestaurantByIdQuery } from './get-restaurant-by-id.query';
import { GetRestaurantByIdResponse, MenuItemEntry } from './get-restaurant-by-id.response';

export interface IGetRestaurantByIdHandler extends IQueryHandler<
  GetRestaurantByIdQuery,
  GetRestaurantByIdResponse
> {}
export const IGetRestaurantByIdHandler = Symbol('IGetRestaurantByIdHandler');

@Injectable()
export class GetRestaurantByIdHandler implements IGetRestaurantByIdHandler {
  constructor(
    @Inject(IRestaurantRepository)
    private readonly restaurantRepository: IRestaurantRepository,
  ) {}

  async handle(query: GetRestaurantByIdQuery): Promise<GetRestaurantByIdResponse> {
    const restaurant = await this.restaurantRepository.findById(query.id);

    if (!restaurant) {
      throw new RestaurantNotFoundError();
    }

    const menuItems = restaurant.menuItems.map(
      (item) =>
        new MenuItemEntry(
          item.id,
          item.name,
          item.description,
          item.price.toString(),
          item.category,
          item.imageUrl,
          item.isAvailable,
          item.createdAt,
        ),
    );

    return new GetRestaurantByIdResponse(
      restaurant.id,
      restaurant.name,
      restaurant.description,
      restaurant.imageUrl,
      restaurant.address,
      restaurant.category,
      restaurant.createdAt,
      menuItems,
    );
  }
}
