import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseArrayPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category as CategoryEntity } from './entities/category.entity';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateCategoryDto } from './dto/create-category.dto';
import { filterCategoryDto } from './dto/filter-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiBearerAuth()
@ApiTags('Categorys')
@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  // Get All Categories
  @UseGuards(AuthGuard)
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'items_per_page', required: false })
  @ApiQuery({ name: 'keyword', required: false })
  @Get()
  getAllcategory(@Query() query: filterCategoryDto): Promise<any> {
    return this.categoryService.getAllCategory(query);
  }

  //Get details of a category
  @UseGuards(AuthGuard)
  @Get(':id')
  getDetailCategory(@Param('id') id: string): Promise<CategoryEntity> {
    return this.categoryService.getDetailCategory(Number(id));
  }

  // create category
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Post()
  create(@Req() req: any, @Body() createCategory: CreateCategoryDto) {
    console.log(req['user_data']);
    console.log('createCategory', createCategory);

    return this.categoryService.create(req['user_data'].id, {
      ...createCategory,
    });
  }

  // update category
  @UseGuards(AuthGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Req() req: any,
    @Body() updateCategory: UpdateCategoryDto,
  ): Promise<any> {
    console.log(req['user_data']);
    console.log('createCategory', updateCategory);
    return this.categoryService.updateCategory(Number(id), updateCategory);
  }

  //delete one category
  @UseGuards(AuthGuard)
  @Delete(':id')
  deleteCategory(@Param('id') id: string) {
    return this.categoryService.deleteCategory(Number(id));
  }

  // Delete Category
  @UseGuards(AuthGuard)
  @Delete('multiple')
  multipleDelete(
    @Query('ids', new ParseArrayPipe({ items: String, separator: ',' }))
    ids: string[],
  ) {
    return this.categoryService.multipleDelete(ids);
  }
}
