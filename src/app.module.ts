import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './infrastructure/auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { ConfigurationModule } from './infrastructure/config/config.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ConfigurationModule,
    PassportModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}