import { Inject, Injectable } from '@nestjs/common';
import { CommandHandlerBase } from '../../../../../../shared/application/command.handler.base';
import { IOrderRepository } from '../../../domain/repositories/order.repo.interface';
import { OrderAccessDeniedError } from '../../errors/order-access-denied.error';
import { OrderNotFoundError } from '../../errors/order-not-found.error';
import { UpdateOrderStatusCommand } from './update-order-status.command';
import { UpdateOrderStatusResponse } from './update-order-status.response';

@Injectable()
export class UpdateOrderStatusHandler extends CommandHandlerBase<
  UpdateOrderStatusCommand,
  UpdateOrderStatusResponse
> {
  constructor(
    @Inject(IOrderRepository)
    private readonly orderRepository: IOrderRepository,
  ) {
    super();
  }

  async handle(command: UpdateOrderStatusCommand): Promise<UpdateOrderStatusResponse> {
    const order = await this.orderRepository.findById(command.orderId);

    if (!order) {
      throw new OrderNotFoundError();
    }

    if (order.userId !== command.userId) {
      throw new OrderAccessDeniedError();
    }

    const updated = await this.orderRepository.updateStatus(command.orderId, command.newStatus);

    return new UpdateOrderStatusResponse(updated.id, updated.status);
  }
}
