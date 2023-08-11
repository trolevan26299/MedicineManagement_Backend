import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Category as CategoryEntity } from './entities/category.entity';
import { DeleteResult, In, Like, Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { User } from 'src/user/entities/user.entity';
import { filterCategoryDto } from './dto/filter-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  // Get All Categorys
  async getAllCategory(query: filterCategoryDto): Promise<any> {
    const items_per_page = Number(query.items_per_page) || 10;
    const page = Number(query.page) || 1;
    const keyword = query.keyword || '';
    const skip = (page - 1) * items_per_page;
    const [data, totalCount] = await this.categoryRepository.findAndCount({
      where: [
        {
          name: Like('%' + keyword + '%'),
        },
        {
          description: Like('%' + keyword + '%'),
        },
      ],
      order: { created_at: 'DESC' },
      take: items_per_page,
      skip,
      relations: {
        user: true,
        posts: true,
      },
      select: {
        user: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
          avatar: true,
        },
        posts: {
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

  async getDetailCategory(id: number): Promise<CategoryEntity> {
    return await this.categoryRepository.findOne({
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

  async create(
    userId: number,
    createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryEntity> {
    const user = await this.userRepository.findOneBy({ id: userId });
    try {
      const res = await this.categoryRepository.save({
        ...createCategoryDto,
        user,
      });

      return await this.categoryRepository.findOneBy({ id: res.id });
    } catch (error) {
      throw new HttpException(
        `Can not create category ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async updateCategory(
    id: number,
    updateCategory: UpdateCategoryDto,
  ): Promise<UpdateResult> {
    return await this.categoryRepository.update(id, updateCategory);
  }
  async deleteCategory(id: number): Promise<DeleteResult> {
    return await this.categoryRepository.delete(id);
  }
  async multipleDelete(ids: string[]): Promise<DeleteResult> {
    return await this.categoryRepository.delete({ id: In(ids) });
  }
}
