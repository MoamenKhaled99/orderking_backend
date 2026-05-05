import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsInt, IsString, IsUUID, Min, MinLength, ValidateNested } from 'class-validator';

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
}
