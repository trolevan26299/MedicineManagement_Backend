/* eslint-disable prettier/prettier */
import { Category } from 'src/category/entities/category.entity';
import { OrderDetail } from 'src/order/entities/order-detail.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class Medicine {
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

  @Column({ type: 'int', default: 0 })
  price_sale: number;

  @Column({ type: 'int', default: 1 })
  status: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.medicines)
  user: User;

  @ManyToOne(() => Category, (category) => category.medicines)
  category: Category;

  @OneToMany(() => OrderDetail, (detail) => detail.medicine, {
    onDelete: 'SET NULL',
  })
  details: OrderDetail[];
}
