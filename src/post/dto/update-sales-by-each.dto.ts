import { ApiProperty } from '@nestjs/swagger';

export class UpdateSaleMedicineByEachDto {
  @ApiProperty()
  id_medicine: number;

  @ApiProperty()
  price_sale: number;
}
