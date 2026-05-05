import { Injectable } from '@nestjs/common';
import type { MenuItem } from '@prisma/client';
import { PrismaService } from '../../../../../prisma/prisma.service';
import { IMenuRepository } from '../../../domain/repositories/menu.repo.interface';

@Injectable()
export class MenuRepository implements IMenuRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByRestaurantId(restaurantId: string): Promise<MenuItem[]> {
    return this.prisma.menuItem.findMany({
      where: { restaurantId, isAvailable: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  findById(id: string): Promise<MenuItem | null> {
    return this.prisma.menuItem.findUnique({ where: { id } });
  }
}
