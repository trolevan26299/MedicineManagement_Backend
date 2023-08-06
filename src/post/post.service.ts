import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, In, Like, Repository, UpdateResult } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { filterPostDto } from './dto/filter-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

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
      throw new HttpException('Can not create post', HttpStatus.BAD_REQUEST);
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
    return await this.postRepository.delete(id);
  }
  async multipleDelete(ids: string[]): Promise<DeleteResult> {
    return await this.postRepository.delete({ id: In(ids) });
  }
}
