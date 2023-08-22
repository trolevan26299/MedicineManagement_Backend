import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { AuthService } from './auth.service';
import { User } from 'src/user/entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from './auth.guard';
import { ForgetPassUserDto } from './dto/forgetPass-user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() registerUser: RegisterUserDto): Promise<User> {
    console.log('register api', registerUser);
    return this.authService.register(registerUser);
  }

  @Post('login')
  @ApiResponse({ status: 201, description: 'Login Success!' })
  @ApiResponse({ status: 401, description: 'Login Fail!' })
  @UsePipes(ValidationPipe)
  login(@Body() loginUser: LoginUserDto): Promise<any> {
    return this.authService.login(loginUser);
  }
  @Post('forget-password')
  @UsePipes(ValidationPipe)
  forgetPassword(@Body() forgetPassUser: ForgetPassUserDto): Promise<any> {
    return this.authService.forgetPass(forgetPassUser);
  }

  @Post('refresh-token')
  refreshToken(@Body() { refresh_token }): Promise<any> {
    return this.authService.refreshToken(refresh_token);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('getUserPermissions')
  getAuthUser(@Req() req: any): Promise<User> {
    return this.authService.getAuthUser(req['user_data'].id);
  }
}
