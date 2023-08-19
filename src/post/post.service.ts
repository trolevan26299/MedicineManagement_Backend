import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, In, Like, Repository, UpdateResult } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { filterPostDto } from './dto/filter-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import * as fs from 'fs';
import { UpdateSaleMedicineByEachDto } from './dto/update-sales-by-each.dto';
import { UpdateSalesMedicineByCategoryDto } from './dto/update-sales-by-category.dto';
import { UpdateMultiDto } from './dto/update-post-multi.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Post) private postRepository: Repository<Post>,
  ) {}

  async create(userId: number, createPostDto: CreatePostDto): Promise<Post> {
    const user = await this.userRepository.findOneBy({ id: userId });
    try {
      const res = await this.postRepository.save({
        ...createPostDto,
        user,
      });
      return await this.postRepository.findOneBy({ id: res.id });
    } catch (error) {
      throw new HttpException(
        `Can not create post ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getAllPost(query: filterPostDto): Promise<any> {
    const items_per_page = Number(query.items_per_page) || 10;
    const page = Number(query.page) || 1;
    const keyword = query.keyword || '';
    const category = Number(query.category) || null;

    const skip = (page - 1) * items_per_page;
    const [data, totalCount] = await this.postRepository.findAndCount({
      where: [
        {
          title: Like('%' + keyword + '%'),
          category: {
            id: category,
          },
        },
        {
          description: Like('%' + keyword + '%'),
          category: {
            id: category,
          },
        },
      ],
      order: { created_at: 'DESC' },
      take: items_per_page,
      skip,
      relations: {
        user: true,
        category: true,
      },
      select: {
        user: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
          avatar: true,
        },
        category: {
          id: true,
          name: true,
          description: true,
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

  async getDetailPost(id: number): Promise<Post> {
    return await this.postRepository.findOne({
      where: { id },
      relations: { user: true, category: true },
      select: {
        user: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
          avatar: true,
        },
        category: {
          id: true,
          name: true,
          description: true,
        },
      },
    });
  }

  async updatePost(
    id: number,
    updatePost: UpdatePostDto,
  ): Promise<UpdateResult> {
    return await this.postRepository.update(id, updatePost);
  }

  async deletePost(id: number): Promise<DeleteResult> {
    const post = await this.postRepository.findOneBy({ id });
    const imagePath = post.thumbnail;
    // Delete post
    const deleteResult = await this.postRepository.delete(id);
    // Delete image
    fs.unlinkSync(imagePath);
    return deleteResult;
  }
  async multipleDelete(ids: string[]): Promise<DeleteResult> {
    const posts = await this.postRepository.findByIds(ids);
    const deleteResult = await this.postRepository.delete({ id: In(ids) });
    // Delete images
    posts.forEach((post) => {
      const imagePath = post.thumbnail;
      fs.unlinkSync(imagePath);
    });
    return deleteResult;
  }

  async updateSaleByEach(
    updateSaleMedicineByEach: UpdateSaleMedicineByEachDto[],
  ): Promise<any> {
    for (const item of updateSaleMedicineByEach) {
      const post = await this.postRepository.findOneBy({
        id: item.id_medicine,
      });
      post.price_sale = item.price_sale;
      await this.postRepository.update(post.id, post);
    }
  }

  async updateSaleByCategory(
    updateSalesMedicineByCategory: UpdateSalesMedicineByCategoryDto[],
  ): Promise<any> {
    for (const item of updateSalesMedicineByCategory) {
      const medicineByCategory = await this.postRepository.find({
        where: {
          category: {
            id: item.id_category,
          },
        },
      });

      for (const medicine of medicineByCategory) {
        await this.postRepository.update(medicine.id, {
          price_sale:
            medicine.price - medicine.price * (item.percent_sales / 100),
        });
      }
    }
  }
}
