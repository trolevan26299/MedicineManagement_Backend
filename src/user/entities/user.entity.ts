import { Category } from 'src/category/entities/category.entity';
import { Customer } from 'src/customer/entities/customer.entity';
import { Order } from 'src/order/entities/order.entity';
import { Post } from 'src/post/entities/post.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true, default: null })
  refresh_token: string;

  @Column({ nullable: true, default: null })
  avatar: string;

  @Column({ default: 1 })
  status: number;

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;

  @Column({ default: 'user' })
  permission: string;

  @OneToMany(() => Post, (post) => post.user, {
    onDelete: 'SET NULL',
  })
  posts: Post[];

  @OneToMany(() => Category, (category) => category.user, {
    onDelete: 'SET NULL',
  })
  category: Category[];

  @OneToMany(() => Order, (order) => order.users, {
    onDelete: 'SET NULL',
  })
  order: Order[];

  @OneToMany(() => Customer, (customer) => customer.user, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  customer: Order[];
}
