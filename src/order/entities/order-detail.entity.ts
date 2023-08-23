import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  RelationId,
} from 'typeorm';
import { Order } from './order.entity';
import { Post } from 'src/post/entities/post.entity';

@Entity()
export class OrderDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.details)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @RelationId((orderDetail: OrderDetail) => orderDetail.order)
  order_id: number;

  @ManyToOne(() => Post, (post) => post.details)
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @RelationId((orderDetail: OrderDetail) => orderDetail.post)
  post_id: number;

  @Column()
  count: number;
}
