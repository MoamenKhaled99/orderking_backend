import {
  Controller, Get, Post, Patch, Param, Body, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SupabaseAuthGuard } from '../auth/internal/infrastructure/guards/supabase-auth.guard';
import { CurrentUser } from '../auth/shared/decorators/current-user.decorator';
import { AuthenticatedUser } from '../auth/shared/contracts/authenticated-user.interface';
import { PrismaService } from '../prisma/prisma.service';
import { UnauthorizedError } from '../../shared/application/errors/unauthorized.error';
import { NotFoundError } from '../../shared/application/errors/not-found.error';

class UpdateDashboardOrderStatusDto {
  @ApiProperty({ enum: ['CONFIRMED', 'CANCELLED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED'] })
  @IsEnum(['CONFIRMED', 'CANCELLED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED'])
  status: string;
}

async function assertOwner(userId: string, prisma: PrismaService) {
  const restaurant = await prisma.restaurant.findFirst({ where: { ownerId: userId } });
  if (!restaurant) throw new UnauthorizedError('Not a restaurant owner');
  return restaurant;
}

@ApiTags('Restaurant Dashboard')
@ApiBearerAuth()
@UseGuards(SupabaseAuthGuard)
@Controller('restaurant-dashboard')
export class RestaurantDashboardController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('orders')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all orders for the restaurant' })
  async getOrders(@CurrentUser() user: AuthenticatedUser) {
    const restaurant = await assertOwner(user.userId, this.prisma);
    const orders = await this.prisma.order.findMany({
      where: { restaurantId: restaurant.id },
      include: { items: { include: { menuItem: true } } },
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
      items: o.items.map((i) => ({
        id: i.id,
        quantity: i.quantity,
        unitPrice: i.unitPrice.toString(),
        menuItem: { id: i.menuItem.id, name: i.menuItem.name },
      })),
    }));
  }

  @Patch('orders/:id/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Accept or decline an order' })
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() dto: UpdateDashboardOrderStatusDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const restaurant = await assertOwner(user.userId, this.prisma);
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundError('Order not found');
    if (order.restaurantId !== restaurant.id) throw new UnauthorizedError('Order does not belong to your restaurant');

    const updated = await this.prisma.order.update({
      where: { id },
      data: { status: dto.status as any },
    });
    return { id: updated.id, status: updated.status };
  }

  @Get('stats')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get restaurant sales stats' })
  async getStats(@CurrentUser() user: AuthenticatedUser) {
    const restaurant = await assertOwner(user.userId, this.prisma);
    const orders = await this.prisma.order.findMany({
      where: { restaurantId: restaurant.id },
      select: { status: true, paymentStatus: true, totalAmount: true, createdAt: true },
    });

    const totalRevenue = orders
      .filter((o) => o.paymentStatus === 'SUCCESS')
      .reduce((sum, o) => sum + Number(o.totalAmount.toString()), 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const ordersToday = orders.filter((o) => new Date(o.createdAt) >= today).length;

    const byStatus = orders.reduce<Record<string, number>>((acc, o) => {
      acc[o.status] = (acc[o.status] ?? 0) + 1;
      return acc;
    }, {});

    return {
      totalRevenue: totalRevenue.toFixed(2),
      totalOrders: orders.length,
      ordersToday,
      byStatus,
      restaurantName: restaurant.name,
    };
  }

  @Get('menu')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all menu items for the restaurant' })
  async getMenu(@CurrentUser() user: AuthenticatedUser) {
    const restaurant = await assertOwner(user.userId, this.prisma);
    const items = await this.prisma.menuItem.findMany({
      where: { restaurantId: restaurant.id },
      orderBy: { category: 'asc' },
    });
    return items.map((i) => ({
      id: i.id,
      name: i.name,
      description: i.description,
      price: i.price.toString(),
      category: i.category,
      imageUrl: i.imageUrl,
      isAvailable: i.isAvailable,
    }));
  }

  @Post('menu')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add a new menu item' })
  async createMenuItem(
    @Body() body: any,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const restaurant = await assertOwner(user.userId, this.prisma);
    const created = await this.prisma.menuItem.create({
      data: {
        restaurantId: restaurant.id,
        name: body.name,
        description: body.description ?? null,
        price: body.price,
        category: body.category,
        imageUrl: body.imageUrl ?? null,
        isAvailable: body.isAvailable ?? true,
      },
    });
    return { ...created, price: created.price.toString() };
  }

  @Patch('menu/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a menu item' })
  async updateMenuItem(
    @Param('id') id: string,
    @Body() body: any,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const restaurant = await assertOwner(user.userId, this.prisma);
    const item = await this.prisma.menuItem.findUnique({ where: { id } });
    if (!item) throw new NotFoundError('Menu item not found');
    if (item.restaurantId !== restaurant.id) throw new UnauthorizedError('Item does not belong to your restaurant');

    const updated = await this.prisma.menuItem.update({
      where: { id },
      data: {
        name: body.name ?? item.name,
        description: body.description !== undefined ? body.description : item.description,
        price: body.price ?? item.price,
        category: body.category ?? item.category,
        imageUrl: body.imageUrl !== undefined ? body.imageUrl : item.imageUrl,
        isAvailable: body.isAvailable ?? item.isAvailable,
      },
    });
    return { ...updated, price: updated.price.toString() };
  }

  @Get('settings')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get restaurant settings' })
  async getSettings(@CurrentUser() user: AuthenticatedUser) {
    const restaurant = await assertOwner(user.userId, this.prisma);
    return {
      id: restaurant.id,
      name: restaurant.name,
      description: restaurant.description,
      address: restaurant.address,
      category: restaurant.category,
      imageUrl: restaurant.imageUrl,
      deliveryFee: restaurant.deliveryFee.toString(),
    };
  }

  @Patch('settings')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update restaurant settings' })
  async updateSettings(
    @Body() body: any,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const restaurant = await assertOwner(user.userId, this.prisma);
    const updated = await this.prisma.restaurant.update({
      where: { id: restaurant.id },
      data: {
        name: body.name ?? restaurant.name,
        description: body.description ?? restaurant.description,
        address: body.address ?? restaurant.address,
        deliveryFee: body.deliveryFee ?? restaurant.deliveryFee,
      },
    });
    return {
      id: updated.id,
      name: updated.name,
      description: updated.description,
      address: updated.address,
      deliveryFee: updated.deliveryFee.toString(),
    };
  }
}
