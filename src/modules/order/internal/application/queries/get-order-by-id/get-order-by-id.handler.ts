import { Inject, Injectable } from '@nestjs/common';
import { IQueryHandler } from '../../../../../../shared/application/query.handler.interface';
import { IOrderRepository } from '../../../domain/repositories/order.repo.interface';
import { OrderAccessDeniedError } from '../../errors/order-access-denied.error';
import { OrderNotFoundError } from '../../errors/order-not-found.error';
import { GetOrderByIdQuery } from './get-order-by-id.query';
import { GetOrderByIdResponse } from './get-order-by-id.response';

export interface IGetOrderByIdHandler
  extends IQueryHandler<GetOrderByIdQuery, GetOrderByIdResponse> {}
export const IGetOrderByIdHandler = Symbol('IGetOrderByIdHandler');

@Injectable()
export class GetOrderByIdHandler implements IGetOrderByIdHandler {
  constructor(
    @Inject(IOrderRepository)
    private readonly orderRepository: IOrderRepository,
  ) {}

  async handle(query: GetOrderByIdQuery): Promise<GetOrderByIdResponse> {
    const order = await this.orderRepository.findById(query.orderId);

    if (!order) {
      throw new OrderNotFoundError();
    }

    if (order.userId !== query.userId) {
      throw new OrderAccessDeniedError();
    }

    return new GetOrderByIdResponse(order);
  }
}
