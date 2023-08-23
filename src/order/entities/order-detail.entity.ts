import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  RelationId,
} from 'typeorm';
import { Order } from './order.entity';
import { Medicine } from 'src/medicine/entities/medicine.entity';

@Entity()
export class OrderDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.details)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @RelationId((orderDetail: OrderDetail) => orderDetail.order)
  order_id: number;

  @ManyToOne(() => Medicine, (medicine) => medicine.details)
  @JoinColumn({ name: 'medicine_id' })
  medicine: Medicine;

  @RelationId((orderDetail: OrderDetail) => orderDetail.medicine)
  medicine_id: number;

  @Column()
  count: number;
}
