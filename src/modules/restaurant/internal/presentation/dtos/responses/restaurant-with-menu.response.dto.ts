import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  GetRestaurantByIdResponse,
  MenuItemEntry,
} from '../../../application/queries/get-restaurant-by-id/get-restaurant-by-id.response';

export class MenuItemResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiPropertyOptional({ nullable: true }) description: string | null;
  @ApiProperty() price: string;
  @ApiProperty() category: string;
  @ApiPropertyOptional({ nullable: true }) imageUrl: string | null;
  @ApiProperty() isAvailable: boolean;
  @ApiProperty() createdAt: Date;

  constructor(data: MenuItemEntry) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.price = data.price;
    this.category = data.category;
    this.imageUrl = data.imageUrl;
    this.isAvailable = data.isAvailable;
    this.createdAt = data.createdAt;
  }
}

export class RestaurantWithMenuResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiPropertyOptional({ nullable: true }) description: string | null;
  @ApiPropertyOptional({ nullable: true }) imageUrl: string | null;
  @ApiProperty() address: string;
  @ApiProperty() category: string;
  @ApiProperty() deliveryFee: string;
  @ApiProperty() createdAt: Date;
  @ApiProperty({ type: [MenuItemResponseDto] }) menuItems: MenuItemResponseDto[];

  constructor(data: GetRestaurantByIdResponse) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.imageUrl = data.imageUrl;
    this.address = data.address;
    this.category = data.category;
    this.deliveryFee = data.deliveryFee;
    this.createdAt = data.createdAt;
    this.menuItems = data.menuItems.map((item) => new MenuItemResponseDto(item));
  }
}
