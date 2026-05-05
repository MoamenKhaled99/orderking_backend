import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MenuItemResult } from '../../../application/queries/get-menu-by-restaurant/get-menu-by-restaurant.response';
import { GetMenuItemByIdResponse } from '../../../application/queries/get-menu-item-by-id/get-menu-item-by-id.response';

export class MenuItemResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() restaurantId: string;
  @ApiProperty() name: string;
  @ApiPropertyOptional({ nullable: true }) description: string | null;
  @ApiProperty() price: string;
  @ApiProperty() category: string;
  @ApiPropertyOptional({ nullable: true }) imageUrl: string | null;
  @ApiProperty() isAvailable: boolean;
  @ApiProperty() createdAt: Date;

  constructor(data: MenuItemResult | GetMenuItemByIdResponse) {
    this.id = data.id;
    this.restaurantId = data.restaurantId;
    this.name = data.name;
    this.description = data.description;
    this.price = data.price;
    this.category = data.category;
    this.imageUrl = data.imageUrl;
    this.isAvailable = data.isAvailable;
    this.createdAt = data.createdAt;
  }
}
