import { Inject, Injectable } from '@nestjs/common';
import { CommandHandlerBase } from '../../../../../../shared/application/command.handler.base';
import { PrismaService } from '../../../../../prisma/prisma.service';
import { IOrderRepository } from '../../../domain/repositories/order.repo.interface';
import { InvalidMenuItemsError } from '../../errors/invalid-menu-items.error';
import { MenuItemsWrongRestaurantError } from '../../errors/menu-items-wrong-restaurant.error';
import { CreateOrderCommand } from './create-order.command';
import { CreateOrderResponse } from './create-order.response';

@Injectable()
export class CreateOrderHandler extends CommandHandlerBase<
  CreateOrderCommand,
  CreateOrderResponse
> {
  constructor(
    @Inject(IOrderRepository)
    private readonly orderRepository: IOrderRepository,
    private readonly prisma: PrismaService,
  ) {
    super();
  }

  async handle(command: CreateOrderCommand): Promise<CreateOrderResponse> {
    const { userId, restaurantId, deliveryAddress, items, idempotencyKey, paymentMethod } = command;

    if (idempotencyKey) {
      const existing = await this.orderRepository.findByIdempotencyKey(idempotencyKey);
      if (existing) return new CreateOrderResponse(existing);
    }

    const menuItemIds = items.map((i) => i.menuItemId);

    // Step 1: Validate all menu items exist and are available
    const foundItems = await this.prisma.menuItem.findMany({
      where: { id: { in: menuItemIds }, isAvailable: true },
    });

    if (foundItems.length !== menuItemIds.length) {
      throw new InvalidMenuItemsError(
        'One or more menu items do not exist or are unavailable',
      );
    }

    // Step 2: Validate all items belong to the given restaurant
    const wrongRestaurant = foundItems.some((item) => item.restaurantId !== restaurantId);
    if (wrongRestaurant) {
      throw new MenuItemsWrongRestaurantError();
    }

    // Step 3: Calculate totalAmount server-side
    const priceMap = new Map(foundItems.map((item) => [item.id, item.price]));
    let totalAmount = 0;
    for (const item of items) {
      const unitPrice = Number(priceMap.get(item.menuItemId)!.toString());
      totalAmount += unitPrice * item.quantity;
    }

    // Step 4: Simulate payment — cash always succeeds; card is 50/50
    const paymentStatus = paymentMethod === 'CASH'
      ? 'SUCCESS'
      : Math.random() < 0.5 ? 'SUCCESS' : 'FAILED';

    // Step 5: Build order items payload with prices from DB
    const orderItemsData = items.map((item) => ({
      menuItemId: item.menuItemId,
      quantity: item.quantity,
      unitPrice: priceMap.get(item.menuItemId)!.toString(),
    }));

    // Step 6: Create Order + OrderItems in a single transaction
    const order = await this.orderRepository.create({
      restaurantId,
      userId,
      paymentStatus,
      paymentMethod,
      totalAmount: totalAmount.toFixed(2),
      deliveryAddress,
      idempotencyKey,
      items: orderItemsData,
    });

    return new CreateOrderResponse(order);
  }
}
