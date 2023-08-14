import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Customer } from 'src/customer/entities/customer.entity';
import { Post } from 'src/post/entities/post.entity';
import { User } from 'src/user/entities/user.entity';

export class UpdateOrderDto {
  @ApiProperty()
  @IsNotEmpty()
  customer: Customer;

  @ApiProperty()
  @IsNotEmpty()
  medicine: Post[];

  @ApiProperty()
  @IsNotEmpty()
  total_price: number;

  @ApiProperty()
  description: string;
}
