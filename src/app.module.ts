import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PriceController } from './price/price.controller';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController, PriceController],
  providers: [AppService],
})
export class AppModule {}
