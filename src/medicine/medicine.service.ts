/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { Medicine } from './entities/medicine.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, In, Like, Repository, UpdateResult } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { filterMedicineDto } from './dto/filter-medicine.dto';
import { UpdateMedicineDto } from './dto/update-medicine.dto';
import * as fs from 'fs';
import { UpdateSaleMedicineByEachDto } from './dto/update-sales-by-each.dto';
import { UpdateSalesMedicineByCategoryDto } from './dto/update-sales-by-category.dto';
import { UpdateMultiDto } from './dto/update-medicine-multi.dto';

@Injectable()
export class MedicineService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Medicine)
    private medicineRepository: Repository<Medicine>,
  ) {}

  async create(
    userId: number,
    createMedicineDto: CreateMedicineDto,
  ): Promise<Medicine> {
    const user = await this.userRepository.findOneBy({ id: userId });
    try {
      const res = await this.medicineRepository.save({
        ...createMedicineDto,
        user,
      });
      return await this.medicineRepository.findOneBy({ id: res.id });
    } catch (error) {
      throw new HttpException(
        `Can not create medicine ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getAllMedicine(query: filterMedicineDto): Promise<any> {
    const items_per_page = Number(query.items_per_page) || 10;
    const page = Number(query.page) || 1;
    const keyword = query.keyword || '';
    const category = Number(query.category) || null;

    const skip = (page - 1) * items_per_page;
    const [data, totalCount] = await this.medicineRepository.findAndCount({
      where: [
        {
          title: Like('%' + keyword + '%'),
          category: {
            id: category,
          },
        },
        {
          description: Like('%' + keyword + '%'),
          category: {
            id: category,
          },
        },
      ],
      order: { created_at: 'DESC' },
      take: items_per_page,
      skip,
      relations: {
        user: true,
        category: true,
      },
      select: {
        user: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
          avatar: true,
        },
        category: {
          id: true,
          name: true,
          description: true,
        },
      },
    });
    const lastPage = Math.ceil(totalCount / items_per_page);
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const prevPage = page - 1 < 1 ? null : page - 1;

    return {
      data,
      totalCount,
      currentPage: page,
      nextPage,
      prevPage,
      lastPage,
    };
  }

  async getDetailMedicine(id: number): Promise<Medicine> {
    return await this.medicineRepository.findOne({
      where: { id },
      relations: { user: true, category: true },
      select: {
        user: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
          avatar: true,
        },
        category: {
          id: true,
          name: true,
          description: true,
        },
      },
    });
  }

  async updateMedicine(
    id: number,
    updateMedicine: UpdateMedicineDto,
  ): Promise<UpdateResult> {
    return await this.medicineRepository.update(id, updateMedicine);
  }

  async deleteMedicine(id: number): Promise<DeleteResult> {
    const medicine = await this.medicineRepository.findOneBy({ id });
    const imagePath = medicine.thumbnail;
    // Delete medicine
    const deleteResult = await this.medicineRepository.delete(id);
    // Delete image
    fs.unlinkSync(imagePath);
    return deleteResult;
  }
  async multipleDelete(ids: string[]): Promise<DeleteResult> {
    const medicines = await this.medicineRepository.findByIds(ids);
    const deleteResult = await this.medicineRepository.delete({ id: In(ids) });
    // Delete images
    medicines.forEach((medicine) => {
      const imagePath = medicine.thumbnail;
      fs.unlinkSync(imagePath);
    });
    return deleteResult;
  }

  async updateSaleByEach(
    updateSaleMedicineByEach: UpdateSaleMedicineByEachDto[],
  ): Promise<any> {
    for (const item of updateSaleMedicineByEach) {
      const medicine = await this.medicineRepository.findOneBy({
        id: item.id_medicine,
      });
      medicine.price_sale = item.price_sale;
      await this.medicineRepository.update(medicine.id, medicine);
    }
  }

  async updateSaleByCategory(
    updateSalesMedicineByCategory: UpdateSalesMedicineByCategoryDto[],
  ): Promise<any> {
    for (const item of updateSalesMedicineByCategory) {
      const medicineByCategory = await this.medicineRepository.find({
        where: {
          category: {
            id: item.id_category,
          },
        },
      });

      for (const medicine of medicineByCategory) {
        await this.medicineRepository.update(medicine.id, {
          price_sale:
            medicine.price - medicine.price * (item.percent_sales / 100),
        });
      }
    }
  }

  async updateMedicineMulti(
    updateMedicineMulti: UpdateMultiDto[],
  ): Promise<any> {
    for (const medicine of updateMedicineMulti) {
      await this.medicineRepository.update(
        { id: medicine.id },
        { quantity: medicine.quantity },
      );
    }
    return updateMedicineMulti;
  }
}
