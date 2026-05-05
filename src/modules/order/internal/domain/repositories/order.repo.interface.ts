import type { Order, OrderItem, MenuItem } from '@prisma/client';

export type OrderWithItems = Order & {
  items: (OrderItem & { menuItem: MenuItem })[];
};

export interface CreateOrderData {
  restaurantId: string;
  userId: string;
  paymentStatus: string;
  paymentMethod: string;
  totalAmount: string;
  deliveryAddress: string;
  idempotencyKey?: string;
  items: Array<{ menuItemId: string; quantity: number; unitPrice: string }>;
}

export interface IOrderRepository {
  findById(id: string): Promise<OrderWithItems | null>;
  findByIdempotencyKey(key: string): Promise<OrderWithItems | null>;
  create(data: CreateOrderData): Promise<OrderWithItems>;
  updateStatus(id: string, status: string): Promise<Order>;
}

export const IOrderRepository = Symbol('IOrderRepository');
