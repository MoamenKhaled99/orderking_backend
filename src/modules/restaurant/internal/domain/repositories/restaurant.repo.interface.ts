import type { Restaurant, MenuItem } from '@prisma/client';

export type RestaurantWithItems = Restaurant & { menuItems: MenuItem[] };

export interface IRestaurantRepository {
  findAll(): Promise<Restaurant[]>;
  findById(id: string): Promise<RestaurantWithItems | null>;
}

export const IRestaurantRepository = Symbol('IRestaurantRepository');
