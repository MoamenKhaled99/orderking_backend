import type { MenuItem } from '@prisma/client';

export interface IMenuRepository {
  findByRestaurantId(restaurantId: string): Promise<MenuItem[]>;
  findById(id: string): Promise<MenuItem | null>;
}

export const IMenuRepository = Symbol('IMenuRepository');
