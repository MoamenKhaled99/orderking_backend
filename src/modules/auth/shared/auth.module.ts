import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SupabaseAuthGuard } from '../internal/infrastructure/guards/supabase-auth.guard';
import { MeController } from '../internal/presentation/controllers/me.controller';

@Module({
  imports: [ConfigModule],
  providers: [SupabaseAuthGuard],
  controllers: [MeController],
  exports: [SupabaseAuthGuard],
})
export class AuthModule {}
