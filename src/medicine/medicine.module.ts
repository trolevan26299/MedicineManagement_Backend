/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MedicineController } from './medicine.controller';
import { MedicineService } from './medicine.service';
import { ConfigModule } from '@nestjs/config';
import { User } from 'src/user/entities/user.entity';
import { Medicine } from './entities/medicine.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User, Medicine]), ConfigModule],
  controllers: [MedicineController],
  providers: [MedicineService],
})
export class MedicineModule {}
