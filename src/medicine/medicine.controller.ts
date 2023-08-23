/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseArrayPipe,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'helpers/config';
import { AuthGuard } from 'src/auth/auth.guard';
import { extname } from 'path';
import { MedicineService } from './medicine.service';
import { filterMedicineDto } from './dto/filter-medicine.dto';
import { Medicine as MedicineEntity } from './entities/medicine.entity';
import { UpdateMedicineDto } from './dto/update-medicine.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UpdateSaleMedicineByEachDto } from './dto/update-sales-by-each.dto';
import { UpdateSalesMedicineByCategoryDto } from './dto/update-sales-by-category.dto';
import { UpdateMultiDto } from './dto/update-medicine-multi.dto';

@ApiBearerAuth()
@ApiTags('Medicines')
@Controller('medicines')
export class MedicineController {
  constructor(private medicineService: MedicineService) {}

  // create medicine
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Post()
  @UseInterceptors(
    FileInterceptor('thumbnail', {
      storage: storageConfig('medicine'),
      fileFilter: (req, file, cb) => {
        const ext = extname(file.originalname);
        const allowedExtArr = ['.jpg', '.png', '.jpeg'];
        if (!allowedExtArr.includes(ext)) {
          req.fileValidationError = `Wrong extension type.Accept file ext are:${allowedExtArr.toString()}`;
          cb(null, false);
        } else {
          const fileSize = parseInt(req.headers['content-length']);
          if (fileSize > 1024 * 1024 * 5) {
            req.fileValidationError =
              'File size is too large.Accept file size is less than 5MB';
            cb(null, false);
          } else {
            cb(null, true);
          }
        }
      },
    }),
  )
  create(
    @Req() req: any,
    @Body() createMedicine: CreateMedicineDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log(req['user_data']);
    console.log('createMedicine', createMedicine);
    console.log('file', file);
    if (req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError);
    }
    if (!file) {
      throw new BadRequestException('File is required');
    }
    return this.medicineService.create(req['user_data'].id, {
      ...createMedicine,
      thumbnail: file.destination + '/' + file.filename,
    });
  }
  // get all medicine
  @UseGuards(AuthGuard)
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'items_per_page', required: false })
  @ApiQuery({ name: 'keyword', required: false })
  @Get()
  getAllMedicine(@Query() query: filterMedicineDto): Promise<any> {
    return this.medicineService.getAllMedicine(query);
  }
  // get detail medicine
  @UseGuards(AuthGuard)
  @Get(':id')
  getDetailMedicine(@Param('id') id: string): Promise<MedicineEntity> {
    return this.medicineService.getDetailMedicine(Number(id));
  }
  // update medicine
  @UseGuards(AuthGuard)
  @Put('update/:id')
  @UseInterceptors(
    FileInterceptor('thumbnail', {
      storage: storageConfig('medicine'),
      fileFilter: (req, file, cb) => {
        const ext = extname(file.originalname);
        const allowedExtArr = ['.jpg', '.png', '.jpeg'];
        if (!allowedExtArr.includes(ext)) {
          req.fileValidationError = `Wrong extension type.Accept file ext are:${allowedExtArr.toString()}`;
          cb(null, false);
        } else {
          const fileSize = parseInt(req.headers['content-length']);
          if (fileSize > 1024 * 1024 * 5) {
            req.fileValidationError =
              'File size is too large.Accept file size is less than 5MB';
            cb(null, false);
          } else {
            cb(null, true);
          }
        }
      },
    }),
  )
  update(
    @Param('id') id: string,
    @Req() req: any,
    @Body() updateMedicine: UpdateMedicineDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    if (req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError);
    }
    if (file) {
      updateMedicine.thumbnail = file.destination + '/' + file.filename;
    }
    return this.medicineService.updateMedicine(Number(id), updateMedicine);
  }

  // Delete Medicines
  @UseGuards(AuthGuard)
  @Delete('multiple')
  multipleDelete(
    @Query('ids', new ParseArrayPipe({ items: String, separator: ',' }))
    ids: string[],
  ) {
    return this.medicineService.multipleDelete(ids);
  }
  //delete one medicine
  @UseGuards(AuthGuard)
  @Delete(':id')
  deleteMedicine(@Param('id') id: string) {
    return this.medicineService.deleteMedicine(Number(id));
  }

  //Sale medicine by each medicine
  @UseGuards(AuthGuard)
  @Patch('sales')
  updateSaleMedicineByEach(
    @Req() req: any,
    @Body() updateSaleMedicineByEach: UpdateSaleMedicineByEachDto[],
  ): Promise<any> {
    return this.medicineService.updateSaleByEach(updateSaleMedicineByEach);
  }
  //Sale medicine by each category
  @UseGuards(AuthGuard)
  @Patch('sales-category')
  updateSaleMedicineByCategory(
    @Req() req: any,
    @Body() updateSalesMedicineByCategory: UpdateSalesMedicineByCategoryDto[],
  ): Promise<any> {
    return this.medicineService.updateSaleByCategory(
      updateSalesMedicineByCategory,
    );
  }

  // update medicine-multi
  @UseGuards(AuthGuard)
  @Put('update-multiple')
  updateMedicineMulti(
    @Body() updateMedicineMulti: UpdateMultiDto[],
  ): Promise<any> {
    return this.medicineService.updateMedicineMulti(updateMedicineMulti);
  }
}
