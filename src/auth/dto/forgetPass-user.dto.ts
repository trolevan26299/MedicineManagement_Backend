import { IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class ForgetPassUserDto {
  @ApiProperty() // hiện mô tả cần nhập trên swagger
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
