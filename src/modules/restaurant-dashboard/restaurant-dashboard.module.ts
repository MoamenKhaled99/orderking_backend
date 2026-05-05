import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/shared/auth.module';
import { RestaurantDashboardController } from './restaurant-dashboard.controller';

@Module({
  imports: [AuthModule],
  controllers: [RestaurantDashboardController],
})
export class RestaurantDashboardModule {}
