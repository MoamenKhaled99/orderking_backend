import { Inject, Injectable } from '@nestjs/common';
import { IQueryHandler } from '../../../../../../shared/application/query.handler.interface';
import { IRestaurantRepository } from '../../../domain/repositories/restaurant.repo.interface';
import { GetAllRestaurantsQuery } from './get-all-restaurants.query';
import { GetAllRestaurantsResponse, RestaurantItem } from './get-all-restaurants.response';

export interface IGetAllRestaurantsHandler extends IQueryHandler<
  GetAllRestaurantsQuery,
  GetAllRestaurantsResponse
> {}
export const IGetAllRestaurantsHandler = Symbol('IGetAllRestaurantsHandler');

@Injectable()
export class GetAllRestaurantsHandler implements IGetAllRestaurantsHandler {
  constructor(
    @Inject(IRestaurantRepository)
    private readonly restaurantRepository: IRestaurantRepository,
  ) {}

  async handle(_query: GetAllRestaurantsQuery): Promise<GetAllRestaurantsResponse> {
    const restaurants = await this.restaurantRepository.findAll();

    const items = restaurants.map(
      (r) =>
        new RestaurantItem(
          r.id,
          r.name,
          r.description,
          r.imageUrl,
          r.address,
          r.category,
          r.createdAt,
        ),
    );

    return new GetAllRestaurantsResponse(items);
  }
}
