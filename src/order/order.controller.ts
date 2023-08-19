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
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Order as OrderEntity } from './entities/order.entity';
import { OrderService } from './order.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { filterOrderDto } from './dto/filter-order.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UpdateMultiDto } from 'src/post/dto/update-post-multi.dto';

@ApiBearerAuth()
@ApiTags('Orders')
@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  // get All Order
  @UseGuards(AuthGuard)
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'items_per_page', required: false })
  @ApiQuery({ name: 'keyword', required: false })
  @Get()
  getAllOrder(@Query() query: filterOrderDto): Promise<any> {
    return this.orderService.getAllOrder(query);
  }

  //Get details of a order
  @UseGuards(AuthGuard)
  @Get(':id')
  getDetailOrder(@Param('id') id: string): Promise<OrderEntity> {
    return this.orderService.getDetailOrder(Number(id));
  }

  // create a order
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Post()
  create(@Req() req: any, @Body() createOrder: CreateOrderDto) {
    console.log(req['user_data']);
    console.log('createOrder', createOrder);

    return this.orderService.create(req['user_data'].id, {
      ...createOrder,
    });
  }

  // update order
  @UseGuards(AuthGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Req() req: any,
    @Body() updateOrder: UpdateOrderDto,
  ): Promise<any> {
    console.log(req['user_data']);
    console.log('updateOrder', updateOrder);
    return this.orderService.updateOrder(Number(id), updateOrder);
  }

  //delete one order
  @UseGuards(AuthGuard)
  @Delete(':id')
  deleteOrder(@Param('id') id: string) {
    return this.orderService.deleteOrder(Number(id));
  }

  // Delete orders
  @UseGuards(AuthGuard)
  @Delete('multiple')
  multipleDelete(
    @Query('ids', new ParseArrayPipe({ items: String, separator: ',' }))
    ids: string[],
  ) {
    return this.orderService.multipleDelete(ids);
  }

  // update post-multi
  @UseGuards(AuthGuard)
  @Put('update-multiple')
  updatePostMulti(@Body() updatePostMulti: UpdateMultiDto[]): Promise<any> {
    return this.orderService.updatePostMulti(updatePostMulti);
  }
}
