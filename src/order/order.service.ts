/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Medicine } from 'src/medicine/entities/medicine.entity';
import { User } from 'src/user/entities/user.entity';
import { DeleteResult, Equal, In, Like, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { filterOrderDto } from './dto/filter-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderDetail as OrderDetailEntity } from './entities/order-detail.entity';
import { Order as OrderEntity } from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Medicine)
    private medicineRepository: Repository<Medicine>,
    @InjectRepository(OrderDetailEntity)
    private orderDetailRepository: Repository<OrderDetailEntity>,
  ) {}
  async getAllOrder(query: filterOrderDto): Promise<any> {
    const items_per_page = Number(query.items_per_page) || 10;
    const page = Number(query.page) || 1;
    const keyword = query.keyword || '';
    const skip = (page - 1) * items_per_page;
    const [data, totalCount] = await this.orderRepository.findAndCount({
      where: [
        {
          id: Equal(Number(keyword)),
        },
        {
          customer: {
            full_name: Like('%' + keyword + '%'),
          },
        },
        {
          customer: {
            phone_number: Like('%' + keyword + '%'),
          },
        },
        {
          users: {
            first_name: Like('%' + keyword + '%'),
          },
        },
        {
          users: {
            last_name: Like('%' + keyword + '%'),
          },
        },
      ],
      order: { created_at: 'DESC' },
      take: items_per_page,
      skip,
      relations: {
        users: true,
        customer: true,
        details: {
          medicine: true,
        },
      },
      select: {
        users: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
          avatar: true,
        },
        customer: {
          id: true,
          full_name: true,
          email: true,
          address: true,
          birth_day: true,
          phone_number: true,
        },

        details: true,
      },
    });
    const lastPage = Math.ceil(totalCount / items_per_page);
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const prevPage = page - 1 < 1 ? null : page - 1;

    return {
      data,
      totalCount,
      currentPage: page,
      nextPage,
      prevPage,
      lastPage,
    };
  }
  async getDetailOrder(id: number): Promise<OrderEntity> {
    return await this.orderRepository.findOne({
      where: { id },
      relations: { customer: true, details: { medicine: true } },
      select: {
        customer: {
          id: true,
          full_name: true,
          phone_number: true,
          address: true,
        },
        details: true,
      },
    });
  }
  // creater order
  async create(
    userId: number,
    createOrder: CreateOrderDto,
  ): Promise<OrderEntity> {
    const users = await this.userRepository.findOneBy({ id: userId });
    console.log('user in service', users);
    try {
      const order = await this.orderRepository.save({
        ...createOrder,
        users,
      });
      for (const detail of createOrder.details) {
        const medicine = await this.medicineRepository.findOneBy({
          id: detail.id,
        });
        const quantityMedicine = medicine.quantity;
        const orderDetail = new OrderDetailEntity();
        orderDetail.order = order;
        orderDetail.medicine = medicine;
        orderDetail.count = detail.count;
        await this.orderDetailRepository.insert(orderDetail);
        await this.medicineRepository.update(
          { id: detail.id },
          {
            quantity: quantityMedicine - orderDetail.count,
          },
        );
      }
      return await this.orderRepository.findOneBy({ id: order.id });
    } catch (error) {
      throw new HttpException(
        `Can not create order ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateOrder(
    id: number,
    updateOrder: UpdateOrderDto,
  ): Promise<OrderEntity> {
    // find the order by id
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['details'],
    });

    await this.orderRepository.update(
      { id },
      {
        description: updateOrder.description,
        total_price: updateOrder.total_price,
        customer: updateOrder.customer,
      },
    );

    await this.orderDetailRepository.delete({ order });

    // add the new details in the order_detail table
    for (const detail of updateOrder.details) {
      const medicine = await this.medicineRepository.findOneBy({
        id: detail.id,
      });
      const orderDetail = new OrderDetailEntity();
      orderDetail.order = order;
      orderDetail.medicine = medicine;
      orderDetail.count = detail.count;
      await this.orderDetailRepository.save(orderDetail);
    }

    return await this.orderRepository.findOneBy({ id });
  }

  async deleteOrder(id: number) {
    // Delete the order details first
    const orderDelete = await this.orderRepository.findOne({
      where: { id },
      relations: ['details'],
    });
    for (const detailDelete of orderDelete.details) {
      const medicineDelete = await this.medicineRepository.findOne({
        where: { id: detailDelete.medicine_id },
      });
      await this.medicineRepository.update(medicineDelete.id, {
        ...medicineDelete,
        quantity: medicineDelete.quantity + detailDelete.count,
      });
    }
    await this.orderDetailRepository.delete({ order: { id } });
    // Delete the order
    return await this.orderRepository.delete(id);
  }
  async multipleDelete(ids: string[]): Promise<DeleteResult> {
    // Delete the order details first
    await this.orderDetailRepository.delete({ order: { id: In(ids) } });
    // Delete the orders
    return await this.orderRepository.delete({ id: In(ids) });
  }
}
