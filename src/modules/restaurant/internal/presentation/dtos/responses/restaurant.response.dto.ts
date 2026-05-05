import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RestaurantItem } from '../../../application/queries/get-all-restaurants/get-all-restaurants.response';

export class RestaurantResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiPropertyOptional({ nullable: true }) description: string | null;
  @ApiPropertyOptional({ nullable: true }) imageUrl: string | null;
  @ApiProperty() address: string;
  @ApiProperty() category: string;
  @ApiProperty() createdAt: Date;

  constructor(data: RestaurantItem) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.imageUrl = data.imageUrl;
    this.address = data.address;
    this.category = data.category;
    this.createdAt = data.createdAt;
  }
}
