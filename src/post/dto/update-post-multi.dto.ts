import { ApiProperty } from '@nestjs/swagger';

export class UpdateMultiDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  quantity: number;
}
