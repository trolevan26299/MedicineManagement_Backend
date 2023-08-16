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
import { CreatePostDto } from './dto/create-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'helpers/config';
import { AuthGuard } from 'src/auth/auth.guard';
import { extname } from 'path';
import { PostService } from './post.service';
import { filterPostDto } from './dto/filter-post.dto';
import { Post as PostEntity } from './entities/post.entity';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UpdateSaleMedicineByEachDto } from './dto/update-sales-by-each.dto';
import { UpdateSalesMedicineByCategoryDto } from './dto/update-sales-by-category.dto';

@ApiBearerAuth()
@ApiTags('Medicines')
@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  // create post
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Post()
  @UseInterceptors(
    FileInterceptor('thumbnail', {
      storage: storageConfig('post'),
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
    @Body() createPost: CreatePostDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log(req['user_data']);
    console.log('createPost', createPost);
    console.log('file', file);
    if (req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError);
    }
    if (!file) {
      throw new BadRequestException('File is required');
    }
    return this.postService.create(req['user_data'].id, {
      ...createPost,
      thumbnail: file.destination + '/' + file.filename,
    });
  }
  // get all post
  @UseGuards(AuthGuard)
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'items_per_page', required: false })
  @ApiQuery({ name: 'keyword', required: false })
  @Get()
  getAllPost(@Query() query: filterPostDto): Promise<any> {
    return this.postService.getAllPost(query);
  }
  // get detail post
  @UseGuards(AuthGuard)
  @Get(':id')
  getDetailPost(@Param('id') id: string): Promise<PostEntity> {
    return this.postService.getDetailPost(Number(id));
  }
  // update post
  @UseGuards(AuthGuard)
  @Put(':id')
  @UseInterceptors(
    FileInterceptor('thumbnail', {
      storage: storageConfig('post'),
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
    @Body() updatePost: UpdatePostDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    if (req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError);
    }
    if (file) {
      updatePost.thumbnail = file.destination + '/' + file.filename;
    }
    return this.postService.updatePost(Number(id), updatePost);
  }

  // Delete Posts
  @UseGuards(AuthGuard)
  @Delete('multiple')
  multipleDelete(
    @Query('ids', new ParseArrayPipe({ items: String, separator: ',' }))
    ids: string[],
  ) {
    return this.postService.multipleDelete(ids);
  }
  //delete one post
  @UseGuards(AuthGuard)
  @Delete(':id')
  deletePost(@Param('id') id: string) {
    return this.postService.deletePost(Number(id));
  }

  //Sale medicine by each medicine
  @UseGuards(AuthGuard)
  @Patch('sales')
  updateSaleMedicineByEach(
    @Req() req: any,
    @Body() updateSaleMedicineByEach: UpdateSaleMedicineByEachDto[],
  ): Promise<any> {
    return this.postService.updateSaleByEach(updateSaleMedicineByEach);
  }
  //Sale medicine by each category
  @UseGuards(AuthGuard)
  @Patch('sales-category')
  updateSaleMedicineByCategory(
    @Req() req: any,
    @Body() updateSalesMedicineByCategory: UpdateSalesMedicineByCategoryDto[],
  ): Promise<any> {
    return this.postService.updateSaleByCategory(updateSalesMedicineByCategory);
  }
}
