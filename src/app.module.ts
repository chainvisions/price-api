import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PriceController } from './price/price.controller';

@Module({
  imports: [],
  controllers: [AppController, PriceController],
  providers: [AppService],
})
export class AppModule {}
