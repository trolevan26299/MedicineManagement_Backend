/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Category } from 'src/category/entities/category.entity';

export class UpdateMedicineDto {
  @ApiProperty()
  title: string;
  @ApiProperty()
  description: string;

  @ApiProperty()
  thumbnail: string;

  @ApiProperty()
  status: number;

  @ApiProperty()
  category: Category;
}
