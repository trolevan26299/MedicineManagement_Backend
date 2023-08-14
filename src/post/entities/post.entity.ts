import { Category } from 'src/category/entities/category.entity';
import { Order } from 'src/order/entities/order.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  thumbnail: string;

  @Column()
  quantity: number;

  @Column()
  price: number;

  @Column({ type: 'int', default: 1 })
  status: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.posts)
  user: User;

  @ManyToOne(() => Category, (category) => category.posts)
  category: Category;

  @ManyToOne(() => Order, (order) => order.post)
  order: Order;
}
