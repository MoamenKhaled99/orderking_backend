import { ICommand } from '../../../../../../shared/application/command.interface';

export class CreateOrderCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly restaurantId: string,
    public readonly deliveryAddress: string,
    public readonly items: Array<{ menuItemId: string; quantity: number }>,
    public readonly idempotencyKey?: string,
    public readonly paymentMethod: 'CASH' | 'CARD' = 'CASH',
  ) {}
}
