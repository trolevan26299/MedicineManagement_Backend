import { IsNotEmpty } from 'class-validator';
import { User } from 'src/user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Post } from 'src/post/entities/post.entity';
import { Customer } from 'src/customer/entities/customer.entity';

export class CreateOrderDto {
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

  user: User;
}
