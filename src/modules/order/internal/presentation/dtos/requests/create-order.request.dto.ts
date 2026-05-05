import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsInt, IsOptional, IsString, IsUUID, Min, MinLength, ValidateNested } from 'class-validator';

class OrderItemDto {
  @ApiProperty({ description: 'Menu item UUID' })
  @IsUUID()
  menuItemId: string;

  @ApiProperty({ minimum: 1 })
  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateOrderRequestDto {
  @ApiProperty({ description: 'Restaurant UUID' })
  @IsUUID()
  restaurantId: string;

  @ApiProperty({ example: '123 Nile Street, Cairo' })
  @IsString()
  @MinLength(5)
  deliveryAddress: string;

  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({ enum: ['CASH', 'CARD'], default: 'CASH' })
  @IsEnum(['CASH', 'CARD'])
  paymentMethod: 'CASH' | 'CARD' = 'CASH';

  @ApiProperty({ required: false, description: 'Client-generated UUID to prevent duplicate orders' })
  @IsOptional()
  @IsUUID()
  idempotencyKey?: string;
}
