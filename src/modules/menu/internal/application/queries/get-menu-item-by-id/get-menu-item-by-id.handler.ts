import { Inject, Injectable } from '@nestjs/common';
import { IQueryHandler } from '../../../../../../shared/application/query.handler.interface';
import { IMenuRepository } from '../../../domain/repositories/menu.repo.interface';
import { MenuItemNotFoundError } from '../../errors/menu-item-not-found.error';
import { GetMenuItemByIdQuery } from './get-menu-item-by-id.query';
import { GetMenuItemByIdResponse } from './get-menu-item-by-id.response';

export interface IGetMenuItemByIdHandler
  extends IQueryHandler<GetMenuItemByIdQuery, GetMenuItemByIdResponse> {}
export const IGetMenuItemByIdHandler = Symbol('IGetMenuItemByIdHandler');

@Injectable()
export class GetMenuItemByIdHandler implements IGetMenuItemByIdHandler {
  constructor(
    @Inject(IMenuRepository)
    private readonly menuRepository: IMenuRepository,
  ) {}

  async handle(query: GetMenuItemByIdQuery): Promise<GetMenuItemByIdResponse> {
    const item = await this.menuRepository.findById(query.id);

    if (!item) {
      throw new MenuItemNotFoundError();
    }

    return new GetMenuItemByIdResponse(
      item.id,
      item.restaurantId,
      item.name,
      item.description,
      item.price.toString(),
      item.category,
      item.imageUrl,
      item.isAvailable,
      item.createdAt,
    );
  }
}
