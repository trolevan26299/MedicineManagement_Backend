/* eslint-disable prettier/prettier */
import { IsNotEmpty } from 'class-validator';
import { User } from 'src/user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty()
  @IsNotEmpty()
  full_name: string;

  @ApiProperty()
  @IsNotEmpty()
  birth_day: Date;

  @ApiProperty()
  @IsNotEmpty()
  phone_number: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  status: number;

  user: User;
}
