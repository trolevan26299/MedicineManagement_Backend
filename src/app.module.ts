import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOption } from 'db/data-source';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PostModule } from './post/post.module';
import { CategoryModule } from './category/category.module';
import { CustomerModule } from './customer/customer.module';
import { OrderModule } from './order/order.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOption),
    UserModule,
    AuthModule,
    ConfigModule,
    PostModule,
    CategoryModule,
    CustomerModule,
    OrderModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        //transport:config.get('MAIL_TRANSPORT')
        transport: {
          host: 'smtp.gmail.com',
          auth: {
            user: 'trolevan26299@gmail.com',
            pass: 'iwyjbyamkecawecp',
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
