import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './modules/prisma/shared/prisma.module';
import { AuthModule } from './modules/auth/shared/auth.module';
import { RestaurantModule } from './modules/restaurant/shared/restaurant.module';
import { MenuModule } from './modules/menu/shared/menu.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      cache: true,
    }),
    PrismaModule,
    AuthModule,
    RestaurantModule,
    MenuModule,
  ],
})
export class AppModule {}
