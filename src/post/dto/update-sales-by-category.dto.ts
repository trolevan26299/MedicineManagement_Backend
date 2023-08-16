import { ApiProperty } from '@nestjs/swagger';

export class UpdateSalesMedicineByCategoryDto {
  @ApiProperty()
  id_category: number;

  @ApiProperty()
  percent_sales: number;
}
