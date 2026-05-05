import { Module } from '@nestjs/common';
import { AuthModule } from '../../auth/shared/auth.module';
import { IOrderRepository } from '../internal/domain/repositories/order.repo.interface';
import { OrderRepository } from '../internal/infrastructure/database/repositories/order.repository';
import { CreateOrderHandler } from '../internal/application/commands/create-order/create-order.handler';
import { UpdateOrderStatusHandler } from '../internal/application/commands/update-order-status/update-order-status.handler';
import {
  GetOrderByIdHandler,
  IGetOrderByIdHandler,
} from '../internal/application/queries/get-order-by-id/get-order-by-id.handler';
import {
  GetOrderStatusHandler,
  IGetOrderStatusHandler,
} from '../internal/application/queries/get-order-status/get-order-status.handler';
import { OrderController } from '../internal/presentation/controllers/order.controller';

@Module({
  imports: [AuthModule],
  providers: [
    { provide: IOrderRepository, useClass: OrderRepository },
    { provide: IGetOrderByIdHandler, useClass: GetOrderByIdHandler },
    { provide: IGetOrderStatusHandler, useClass: GetOrderStatusHandler },
    OrderRepository,
    CreateOrderHandler,
    UpdateOrderStatusHandler,
    GetOrderByIdHandler,
    GetOrderStatusHandler,
  ],
  controllers: [OrderController],
})
export class OrderModule {}
