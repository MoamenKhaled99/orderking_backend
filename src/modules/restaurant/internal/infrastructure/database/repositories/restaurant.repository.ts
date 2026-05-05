import { Injectable } from '@nestjs/common';
import type { Restaurant } from '@prisma/client';
import { PrismaService } from '../../../../../prisma/prisma.service';
import {
  IRestaurantRepository,
  RestaurantWithItems,
} from '../../../domain/repositories/restaurant.repo.interface';

@Injectable()
export class RestaurantRepository implements IRestaurantRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<Restaurant[]> {
    return this.prisma.restaurant.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  findById(id: string): Promise<RestaurantWithItems | null> {
    return this.prisma.restaurant.findUnique({
      where: { id },
      include: {
        menuItems: {
          where: { isAvailable: true },
          orderBy: { createdAt: 'asc' },
        },
      },
    });
  }
}
