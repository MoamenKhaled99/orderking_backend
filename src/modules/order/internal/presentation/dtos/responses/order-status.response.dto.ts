import { ApiProperty } from '@nestjs/swagger';
import { GetOrderStatusResponse } from '../../../application/queries/get-order-status/get-order-status.response';

export class OrderStatusResponseDto {
  @ApiProperty() orderId: string;
  @ApiProperty() status: string;
  @ApiProperty() paymentStatus: string;

  constructor(data: GetOrderStatusResponse) {
    this.orderId = data.orderId;
    this.status = data.status;
    this.paymentStatus = data.paymentStatus;
  }
}
