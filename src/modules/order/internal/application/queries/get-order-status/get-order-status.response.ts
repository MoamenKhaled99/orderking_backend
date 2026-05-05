export class GetOrderStatusResponse {
  constructor(
    public readonly orderId: string,
    public readonly status: string,
    public readonly paymentStatus: string,
  ) {}
}
