import { Controller, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SupabaseAuthGuard } from '../../infrastructure/guards/supabase-auth.guard';
import { CurrentUser } from '../../../shared/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../../shared/contracts/authenticated-user.interface';
import { PrismaService } from '../../../../prisma/prisma.service';

@ApiTags('Me')
@ApiBearerAuth()
@UseGuards(SupabaseAuthGuard)
@Controller('me')
export class MeController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get current user role' })
  async getMe(@CurrentUser() user: AuthenticatedUser) {
    const restaurant = await this.prisma.restaurant.findFirst({
      where: { ownerId: user.userId },
      select: { id: true },
    });
    if (restaurant) {
      return { role: 'RESTAURANT_OWNER', restaurantId: restaurant.id };
    }
    return { role: 'CUSTOMER' };
  }
}
