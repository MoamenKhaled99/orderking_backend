import { Injectable } from '@nestjs/common';
import type { Order } from '@prisma/client';
import { PrismaService } from '../../../../../prisma/prisma.service';
import {
  CreateOrderData,
  IOrderRepository,
  OrderWithItems,
} from '../../../domain/repositories/order.repo.interface';

@Injectable()
export class OrderRepository implements IOrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  findById(id: string): Promise<OrderWithItems | null> {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { menuItem: true } },
      },
    });
  }

  findByIdempotencyKey(key: string): Promise<OrderWithItems | null> {
    return this.prisma.order.findUnique({
      where: { idempotencyKey: key },
      include: {
        items: { include: { menuItem: true } },
      },
    });
  }

  async create(data: CreateOrderData): Promise<OrderWithItems> {
    return this.prisma.$transaction(async (tx) => {
      return tx.order.create({
        data: {
          restaurantId: data.restaurantId,
          userId: data.userId,
          paymentStatus: data.paymentStatus as any,
          paymentMethod: data.paymentMethod as any,
          totalAmount: data.totalAmount,
          deliveryAddress: data.deliveryAddress,
          idempotencyKey: data.idempotencyKey,
          status: 'PENDING',
          items: {
            create: data.items.map((item) => ({
              menuItemId: item.menuItemId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
            })),
          },
        },
        include: {
          items: { include: { menuItem: true } },
        },
      });
    });
  }

  updateStatus(id: string, status: string): Promise<Order> {
    return this.prisma.order.update({
      where: { id },
      data: { status: status as any },
    });
  }
}
