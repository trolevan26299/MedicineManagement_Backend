/* eslint-disable prettier/prettier */
import { Customer } from 'src/customer/entities/customer.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';

import { OrderDetail } from './order-detail.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column()
  total_price: number;

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.order)
  users: User;

  @ManyToOne(() => Customer, (customer) => customer.order)
  customer: Customer;

  @OneToMany(() => OrderDetail, (detail) => detail.order, {
    onDelete: 'SET NULL',
  })
  details: OrderDetail[];
}
