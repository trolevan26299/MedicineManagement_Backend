/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { CategoryController } from './category.controller';
import { ConfigModule } from '@nestjs/config';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Category]), ConfigModule],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
