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
import { CustomerService } from './customer.service';
import { Customer as CustomerEntity } from './entities/customer.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { filterCustomerDto } from './dto/filter-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@ApiBearerAuth()
@ApiTags('Customers')
@Controller('customer')
export class CustomerController {
  constructor(private customerService: CustomerService) {}

  // Get All Customer
  @UseGuards(AuthGuard)
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'items_per_page', required: false })
  @ApiQuery({ name: 'keyword', required: false })
  @Get()
  getAllCustomer(@Query() query: filterCustomerDto): Promise<any> {
    return this.customerService.getAllCustomer(query);
  }

  //Get details of a customer
  @UseGuards(AuthGuard)
  @Get(':id')
  getDetailCustomer(@Param('id') id: string): Promise<CustomerEntity> {
    return this.customerService.getDetailCustomer(Number(id));
  }
  //Get details order a customer
  @UseGuards(AuthGuard)
  @Get('order/:id')
  getDetailOrderCustomer(
    @Param('id') id: string,
    @Query() query: filterCustomerDto,
  ): Promise<Promise<any>> {
    return this.customerService.getDetailOrderCustomer(Number(id), query);
  }

  // create customer
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Post()
  create(@Req() req: any, @Body() createCategory: CreateCustomerDto) {
    console.log(req['user_data']);
    console.log('createCategory', createCategory);

    return this.customerService.create(req['user_data'].id, {
      ...createCategory,
    });
  }

  // update customer
  @UseGuards(AuthGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Req() req: any,
    @Body() updateCustomer: UpdateCustomerDto,
  ): Promise<any> {
    console.log(req['user_data']);
    console.log('createCustomer', updateCustomer);
    return this.customerService.updateCustomer(Number(id), updateCustomer);
  }

  //delete one customer
  @UseGuards(AuthGuard)
  @Delete(':id')
  deleteCategory(@Param('id') id: string) {
    return this.customerService.deleteCustomer(Number(id));
  }

  // Delete Customers
  @UseGuards(AuthGuard)
  @Delete('multiple')
  multipleDelete(
    @Query('ids', new ParseArrayPipe({ items: String, separator: ',' }))
    ids: string[],
  ) {
    return this.customerService.multipleDelete(ids);
  }
}
