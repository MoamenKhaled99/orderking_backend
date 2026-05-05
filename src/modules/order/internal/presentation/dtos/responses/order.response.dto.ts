import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderWithItems } from '../../../domain/repositories/order.repo.interface';

class OrderMenuItemDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiProperty() price: string;
  @ApiProperty() category: string;
}

class OrderItemDto {
  @ApiProperty() id: string;
  @ApiProperty() menuItemId: string;
  @ApiProperty() quantity: number;
  @ApiProperty() unitPrice: string;
  @ApiProperty({ type: OrderMenuItemDto }) menuItem: OrderMenuItemDto;
}

export class OrderResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() restaurantId: string;
  @ApiProperty() userId: string;
  @ApiProperty() status: string;
  @ApiProperty() paymentStatus: string;
  @ApiProperty() totalAmount: string;
  @ApiProperty() deliveryAddress: string;
  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;
  @ApiProperty({ type: [OrderItemDto] }) items: OrderItemDto[];

  constructor(data: OrderWithItems) {
    this.id = data.id;
    this.restaurantId = data.restaurantId;
    this.userId = data.userId;
    this.status = data.status;
    this.paymentStatus = data.paymentStatus;
    this.totalAmount = data.totalAmount.toString();
    this.deliveryAddress = data.deliveryAddress;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.items = data.items.map((item) => ({
      id: item.id,
      menuItemId: item.menuItemId,
      quantity: item.quantity,
      unitPrice: item.unitPrice.toString(),
      menuItem: {
        id: item.menuItem.id,
        name: item.menuItem.name,
        price: item.menuItem.price.toString(),
        category: item.menuItem.category,
      },
    }));
  }
}
