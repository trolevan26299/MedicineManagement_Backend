import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Customer } from 'src/customer/entities/customer.entity';
import { Post } from 'src/post/entities/post.entity';
import { ConfigModule } from '@nestjs/config';
import { Order } from './entities/order.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Customer, Post, Order]),
    ConfigModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
