export class GetMenuItemByIdResponse {
  constructor(
    public readonly id: string,
    public readonly restaurantId: string,
    public readonly name: string,
    public readonly description: string | null,
    public readonly price: string,
    public readonly category: string,
    public readonly imageUrl: string | null,
    public readonly isAvailable: boolean,
    public readonly createdAt: Date,
  ) {}
}
