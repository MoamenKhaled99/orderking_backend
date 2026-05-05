import { Inject, Injectable } from '@nestjs/common';
import { IQueryHandler } from '../../../../../../shared/application/query.handler.interface';
import { IMenuRepository } from '../../../domain/repositories/menu.repo.interface';
import { GetMenuByRestaurantQuery } from './get-menu-by-restaurant.query';
import { GetMenuByRestaurantResponse, MenuItemResult } from './get-menu-by-restaurant.response';

export interface IGetMenuByRestaurantHandler
  extends IQueryHandler<GetMenuByRestaurantQuery, GetMenuByRestaurantResponse> {}
export const IGetMenuByRestaurantHandler = Symbol('IGetMenuByRestaurantHandler');

@Injectable()
export class GetMenuByRestaurantHandler implements IGetMenuByRestaurantHandler {
  constructor(
    @Inject(IMenuRepository)
    private readonly menuRepository: IMenuRepository,
  ) {}

  async handle(query: GetMenuByRestaurantQuery): Promise<GetMenuByRestaurantResponse> {
    const items = await this.menuRepository.findByRestaurantId(query.restaurantId);

    const results = items.map(
      (item) =>
        new MenuItemResult(
          item.id,
          item.restaurantId,
          item.name,
          item.description,
          item.price.toString(),
          item.category,
          item.imageUrl,
          item.isAvailable,
          item.createdAt,
        ),
    );

    return new GetMenuByRestaurantResponse(results);
  }
}
