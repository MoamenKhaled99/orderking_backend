import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { SupabaseAuthGuard } from '../../../../auth/internal/infrastructure/guards/supabase-auth.guard';
import { CurrentUser } from '../../../../auth/shared/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../../../auth/shared/contracts/authenticated-user.interface';
import { CreateOrderHandler } from '../../application/commands/create-order/create-order.handler';
import { UpdateOrderStatusHandler } from '../../application/commands/update-order-status/update-order-status.handler';
import {
  IGetOrderByIdHandler,
} from '../../application/queries/get-order-by-id/get-order-by-id.handler';
import {
  IGetOrderStatusHandler,
} from '../../application/queries/get-order-status/get-order-status.handler';
import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateOrderCommand } from '../../application/commands/create-order/create-order.command';
import { UpdateOrderStatusCommand } from '../../application/commands/update-order-status/update-order-status.command';
import { GetOrderByIdQuery } from '../../application/queries/get-order-by-id/get-order-by-id.query';
import { GetOrderStatusQuery } from '../../application/queries/get-order-status/get-order-status.query';
import { CreateOrderRequestDto } from '../dtos/requests/create-order.request.dto';
import { UpdateOrderStatusRequestDto } from '../dtos/requests/update-order-status.request.dto';
import { OrderResponseDto } from '../dtos/responses/order.response.dto';
import { OrderStatusResponseDto } from '../dtos/responses/order-status.response.dto';

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(SupabaseAuthGuard)
@Controller('orders')
export class OrderController {
  constructor(
    private readonly createOrderHandler: CreateOrderHandler,
    private readonly updateStatusHandler: UpdateOrderStatusHandler,
    @Inject(IGetOrderByIdHandler)
    private readonly getOrderByIdHandler: IGetOrderByIdHandler,
    @Inject(IGetOrderStatusHandler)
    private readonly getOrderStatusHandler: IGetOrderStatusHandler,
    private readonly prisma: PrismaService,
  ) {}

  @Get('my')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all orders for the authenticated user' })
  async getMyOrders(@CurrentUser() user: AuthenticatedUser) {
    const orders = await this.prisma.order.findMany({
      where: { userId: user.userId },
      include: {
        items: { include: { menuItem: true } },
        restaurant: { select: { id: true, name: true, imageUrl: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return orders.map((o) => ({
      id: o.id,
      status: o.status,
      paymentStatus: o.paymentStatus,
      paymentMethod: o.paymentMethod,
      totalAmount: o.totalAmount.toString(),
      deliveryAddress: o.deliveryAddress,
      createdAt: o.createdAt,
      restaurant: o.restaurant,
      items: o.items.map((i) => ({
        id: i.id,
        quantity: i.quantity,
        unitPrice: i.unitPrice.toString(),
        menuItem: { id: i.menuItem.id, name: i.menuItem.name },
      })),
    }));
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Place a new order' })
  async createOrder(
    @Body() dto: CreateOrderRequestDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<OrderResponseDto> {
    const command = new CreateOrderCommand(
      user.userId,
      dto.restaurantId,
      dto.deliveryAddress,
      dto.items,
      dto.idempotencyKey,
      dto.paymentMethod,
    );
    const result = await this.createOrderHandler.handle(command);
    return new OrderResponseDto(result.order);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get an order with its items' })
  @ApiParam({ name: 'id', description: 'Order UUID' })
  async getOrder(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<OrderResponseDto> {
    const result = await this.getOrderByIdHandler.handle(new GetOrderByIdQuery(id, user.userId));
    return new OrderResponseDto(result.order);
  }

  @Get(':id/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get order status only' })
  @ApiParam({ name: 'id', description: 'Order UUID' })
  async getOrderStatus(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<OrderStatusResponseDto> {
    const result = await this.getOrderStatusHandler.handle(
      new GetOrderStatusQuery(id, user.userId),
    );
    return new OrderStatusResponseDto(result);
  }

  @Patch(':id/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update order status' })
  @ApiParam({ name: 'id', description: 'Order UUID' })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusRequestDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const command = new UpdateOrderStatusCommand(id, user.userId, dto.status);
    return this.updateStatusHandler.handle(command);
  }
}
