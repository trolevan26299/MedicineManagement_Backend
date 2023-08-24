/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsNotEmpty,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Customer } from 'src/customer/entities/customer.entity';

class DetailOrderDto {
  @IsNotEmpty()
  id: number;

  @IsNumber()
  count: number;
}
export class UpdateOrderDto {
  @ApiProperty()
  @IsNotEmpty()
  customer: Customer;

  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => DetailOrderDto)
  details: DetailOrderDto[];

  @ApiProperty()
  @IsNotEmpty()
  total_price: number;

  @ApiProperty()
  description: string;
}
