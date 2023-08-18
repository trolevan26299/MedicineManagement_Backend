import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, In, Like, Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findAllUsers(query: FilterUserDto): Promise<any> {
    const items_per_page = Number(query.items_per_page) || 10;
    const page = Number(query.page) || 1;
    const skip = (page - 1) * items_per_page;
    const keyword = query.keyword || '';
    const [data, totalCount] = await this.userRepository.findAndCount({
      where: [
        { first_name: Like(`%${keyword}%`) },
        { last_name: Like(`%${keyword}%`) },
        { email: Like(`%${keyword}%`) },
      ],
      order: { created_at: 'DESC' },
      take: items_per_page,
      skip: skip,
      select: [
        'id',
        'first_name',
        'last_name',
        'email',
        'status',
        'created_at',
        'updated_at',
      ],
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

  async findUser(id: number): Promise<User> {
    return await this.userRepository.findOneBy({ id });
  }

  async createUser(createUser: CreateUserDto): Promise<User> {
    const checkEmailExists = await this.userRepository.findOne({
      where: { email: createUser.email },
    });
    if (checkEmailExists) {
      throw new HttpException(
        'Can not create user,Email already exists ! ',
        HttpStatus.BAD_REQUEST,
      );
    } else {
      const hashPW = await bcrypt.hash(createUser.password, 10);
      return await this.userRepository.save({
        ...createUser,
        password: hashPW,
      });
    }
  }

  async updateUser(
    id: number,
    updateUser: UpdateUserDto,
  ): Promise<UpdateResult> {
    const hashPW = await bcrypt.hash(updateUser.password, 10);
    return await this.userRepository.update(id, {
      ...updateUser,
      password: hashPW,
    });
  }
  async deleteUser(id: number): Promise<DeleteResult> {
    return await this.userRepository.delete(id);
  }
  async multipleDelete(ids: string[]): Promise<DeleteResult> {
    return await this.userRepository.delete({ id: In(ids) });
  }

  async updateAvatar(id: number, avatar: string): Promise<UpdateResult> {
    return this.userRepository.update(id, { avatar });
  }
}
