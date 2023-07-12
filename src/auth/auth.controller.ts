import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { AuthService } from './auth.service';
import { User } from 'src/user/entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

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

  @Post('refresh-token')
  refreshToken(@Body() { refresh_token }): Promise<any> {
    return this.authService.refreshToken(refresh_token);
  }
}
