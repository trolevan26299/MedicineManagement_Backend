/* eslint-disable prettier/prettier */
import { IsNotEmpty } from 'class-validator';
import { User } from 'src/user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Category } from 'src/category/entities/category.entity';

export class CreateMedicineDto {
  @ApiProperty()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  thumbnail: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  price: number;

  @ApiProperty()
  price_sale: number;

  @ApiProperty()
  status: number;

  user: User;

  @ApiProperty()
  @IsNotEmpty()
  category: Category;
}
