export class UpdateOrderStatusResponse {
  constructor(
    public readonly orderId: string,
    public readonly status: string,
  ) {}
}
