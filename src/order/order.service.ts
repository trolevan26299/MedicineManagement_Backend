import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Order as OrderEntity } from './entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, In, Like, Repository, UpdateResult } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { filterOrderDto } from './dto/filter-order.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { Customer } from 'src/customer/entities/customer.entity';
import { Post } from 'src/post/entities/post.entity';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}
  async getAllOrder(query: filterOrderDto): Promise<any> {
    const items_per_page = Number(query.items_per_page) || 10;
    const page = Number(query.page) || 1;
    const keyword = query.keyword || '';
    const skip = (page - 1) * items_per_page;
    const [data, totalCount] = await this.orderRepository.findAndCount({
      where: [
        // {
        //   id: Like('%' + keyword + '%'),
        // },
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
        post: true,
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
        post: {
          id: true,
          title: true,
          price: true,
        },
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
      relations: { customer: true, post: true },
      select: {
        customer: {
          id: true,
          full_name: true,
          phone_number: true,
          address: true,
        },
        post: {
          id: true,
          title: true,
          price: true,
        },
      },
    });
  }
  // creater order
  async create(
    userId: number,
    createOrder: CreateOrderDto,
  ): Promise<OrderEntity> {
    const user = await this.userRepository.findOneBy({ id: userId });
    try {
      const res = await this.orderRepository.save({
        ...createOrder,
        user,
      });

      return await this.orderRepository.findOneBy({ id: res.id });
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
  ): Promise<UpdateResult> {
    return await this.orderRepository.update(id, updateOrder);
  }
  async deleteOrder(id: number): Promise<DeleteResult> {
    return await this.orderRepository.delete(id);
  }
  async multipleDelete(ids: string[]): Promise<DeleteResult> {
    return await this.orderRepository.delete({ id: In(ids) });
  }
}
