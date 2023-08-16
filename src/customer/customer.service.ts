import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer as CustomerEntity } from './entities/customer.entity';
import {
  DeleteResult,
  In,
  Like,
  OrderedBulkOperation,
  Repository,
  UpdateResult,
} from 'typeorm';
import { Order as OrderEntity } from '../order/entities/order.entity';
import { User } from 'src/user/entities/user.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { filterCustomerDto } from './dto/filter-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(CustomerEntity)
    private customerRepository: Repository<CustomerEntity>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
  ) {}

  async getAllCustomer(query: filterCustomerDto): Promise<any> {
    const items_per_page = Number(query.items_per_page) || 10;
    const page = Number(query.page) || 1;
    const keyword = query.keyword || '';
    const skip = (page - 1) * items_per_page;
    const [data, totalCount] = await this.customerRepository.findAndCount({
      where: [
        {
          full_name: Like('%' + keyword + '%'),
        },
        {
          phone_number: Like('%' + keyword + '%'),
        },
        {
          email: Like('%' + keyword + '%'),
        },
      ],
      order: { created_at: 'DESC' },
      take: items_per_page,
      skip,
      relations: {
        user: true,
      },
      select: {
        user: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
          avatar: true,
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
  async getDetailCustomer(id: number): Promise<CustomerEntity> {
    return await this.customerRepository.findOne({
      where: { id },
      relations: { user: true },
      select: {
        user: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
          avatar: true,
        },
      },
    });
  }
  // creater customer
  async create(
    userId: number,
    createCustomer: CreateCustomerDto,
  ): Promise<CustomerEntity> {
    const user = await this.userRepository.findOneBy({ id: userId });
    try {
      const res = await this.customerRepository.save({
        ...createCustomer,
        user,
      });

      return await this.customerRepository.findOneBy({ id: res.id });
    } catch (error) {
      throw new HttpException(
        `Can not create customer ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async updateCustomer(
    id: number,
    updateCustomer: UpdateCustomerDto,
  ): Promise<UpdateResult> {
    return await this.customerRepository.update(id, updateCustomer);
  }
  async deleteCustomer(id: number): Promise<DeleteResult> {
    return await this.customerRepository.delete(id);
  }
  async multipleDelete(ids: string[]): Promise<DeleteResult> {
    return await this.customerRepository.delete({ id: In(ids) });
  }
  async getDetailOrderCustomer(
    id: number,
    query: filterCustomerDto,
  ): Promise<Promise<any>> {
    const items_per_page = Number(query.items_per_page) || 10;
    const page = Number(query.page) || 1;
    const keyword = query.keyword || '';
    const skip = (page - 1) * items_per_page;
    const [data, totalCount] = await this.orderRepository.findAndCount({
      where: [
        {
          customer: {
            id,
          },
        },
      ],
      order: { created_at: 'DESC' },
      take: items_per_page,
      skip,
      relations: {
        customer: true,
        details: {
          post: true,
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
}
