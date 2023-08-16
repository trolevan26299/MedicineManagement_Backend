import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { CustomerController } from './customer.controller';
import { Customer } from './entities/customer.entity';
import { Order } from 'src/order/entities/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Customer, Order]), ConfigModule],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule {}
