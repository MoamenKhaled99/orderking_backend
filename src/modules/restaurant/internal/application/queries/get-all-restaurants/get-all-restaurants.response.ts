export class RestaurantItem {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string | null,
    public readonly imageUrl: string | null,
    public readonly address: string,
    public readonly category: string,
    public readonly createdAt: Date,
  ) {}
}

export class GetAllRestaurantsResponse {
  constructor(public readonly restaurants: RestaurantItem[]) {}
}
