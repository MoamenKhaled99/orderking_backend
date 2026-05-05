import { Controller, Get, Post, Body, Param, HttpCode, HttpStatus, Inject, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, Min, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IGetAllRestaurantsHandler } from '../../application/queries/get-all-restaurants/get-all-restaurants.handler';
import { IGetRestaurantByIdHandler } from '../../application/queries/get-restaurant-by-id/get-restaurant-by-id.handler';
import { GetAllRestaurantsQuery } from '../../application/queries/get-all-restaurants/get-all-restaurants.query';
import { GetRestaurantByIdQuery } from '../../application/queries/get-restaurant-by-id/get-restaurant-by-id.query';
import { RestaurantResponseDto } from '../dtos/responses/restaurant.response.dto';
import { RestaurantWithMenuResponseDto } from '../dtos/responses/restaurant-with-menu.response.dto';
import { SupabaseAuthGuard } from '../../../../auth/internal/infrastructure/guards/supabase-auth.guard';
import { CurrentUser } from '../../../../auth/shared/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../../../auth/shared/contracts/authenticated-user.interface';
import { PrismaService } from '../../../../prisma/prisma.service';
import { BadRequestError } from '../../../../../shared/application/errors/bad-request.error';

class RegisterRestaurantDto {
  @ApiProperty() @IsString() @MinLength(2) name: string;
  @ApiProperty() @IsString() @MinLength(2) category: string;
  @ApiProperty() @IsString() @MinLength(5) address: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() @Min(0) deliveryFee?: number;
}

@ApiTags('Restaurants')
@Controller('restaurants')
export class RestaurantController {
  constructor(
    @Inject(IGetAllRestaurantsHandler)
    private readonly getAllHandler: IGetAllRestaurantsHandler,
    @Inject(IGetRestaurantByIdHandler)
    private readonly getByIdHandler: IGetRestaurantByIdHandler,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List all restaurants' })
  async getAll(): Promise<RestaurantResponseDto[]> {
    const result = await this.getAllHandler.handle(new GetAllRestaurantsQuery());
    return result.restaurants.map((r) => new RestaurantResponseDto(r));
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a restaurant with its menu items' })
  @ApiParam({ name: 'id', description: 'Restaurant UUID' })
  async getById(@Param('id') id: string): Promise<RestaurantWithMenuResponseDto> {
    const result = await this.getByIdHandler.handle(new GetRestaurantByIdQuery(id));
    return new RestaurantWithMenuResponseDto(result);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(SupabaseAuthGuard)
  @ApiOperation({ summary: 'Register a new restaurant (Become a Partner)' })
  async register(
    @Body() dto: RegisterRestaurantDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const existing = await this.prisma.restaurant.findFirst({
      where: { ownerId: user.userId },
    });
    if (existing) throw new BadRequestError('You already own a restaurant');

    const restaurant = await this.prisma.restaurant.create({
      data: {
        name: dto.name,
        category: dto.category,
        address: dto.address,
        description: dto.description ?? null,
        deliveryFee: dto.deliveryFee ?? 0,
        ownerId: user.userId,
      },
    });
    return {
      id: restaurant.id,
      name: restaurant.name,
      category: restaurant.category,
      address: restaurant.address,
      deliveryFee: restaurant.deliveryFee.toString(),
    };
  }
}
