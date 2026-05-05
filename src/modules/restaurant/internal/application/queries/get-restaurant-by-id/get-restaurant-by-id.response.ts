import { RestaurantItem } from '../get-all-restaurants/get-all-restaurants.response';

export class MenuItemEntry {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string | null,
    public readonly price: string,
    public readonly category: string,
    public readonly imageUrl: string | null,
    public readonly isAvailable: boolean,
    public readonly createdAt: Date,
  ) {}
}

export class GetRestaurantByIdResponse extends RestaurantItem {
  constructor(
    id: string,
    name: string,
    description: string | null,
    imageUrl: string | null,
    address: string,
    category: string,
    createdAt: Date,
    deliveryFee: string,
    public readonly menuItems: MenuItemEntry[],
  ) {
    super(id, name, description, imageUrl, address, category, createdAt, deliveryFee);
  }
}
