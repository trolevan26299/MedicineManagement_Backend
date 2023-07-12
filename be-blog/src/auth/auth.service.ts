import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private JwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerUser: RegisterUserDto): Promise<User> {
    const hashPassword = await this.hashPassword(registerUser.password);
    return await this.userRepository.save({
      ...registerUser,
      refresh_token: 'refresh_token_string',
      password: hashPassword,
    });
  }

  async login(loginUser: LoginUserDto): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email: loginUser.email },
    });
    if (!user) {
      throw new HttpException('Email is not exist', HttpStatus.UNAUTHORIZED);
    }
    const checkPass = bcrypt.compareSync(loginUser.password, user.password);

    if (!checkPass) {
      throw new HttpException(
        'Password is not correct !',
        HttpStatus.UNAUTHORIZED,
      );
    }
    //generate access token and refresh token
    const payload = { id: user.id, email: user.email };
    return this.generateToken(payload);
  }

  async refreshToken(refresh_token: string): Promise<any> {
    try {
      const verify = await this.JwtService.verifyAsync(refresh_token, {
        secret: 'Tro@260299',
      });

      const checkExistToken = await this.userRepository.findOneBy({
        email: verify.email,
        id: verify.id,
      });

      if (checkExistToken) {
        return this.generateToken({ id: verify.id, email: verify.email });
      } else {
        throw new HttpException(
          'Refresh Token is not valid',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      throw new HttpException(
        'Refresh token is not valid',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async generateToken(payload: { id: number; email: string }) {
    const access_token = await this.JwtService.signAsync(payload);
    const refresh_token = await this.JwtService.signAsync(payload, {
      secret: 'Tro@260299',
      expiresIn: '7d',
    });
    await this.userRepository.update(
      { email: payload.email },
      { refresh_token: refresh_token },
    );
    return { access_token, refresh_token };
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const hash = await bcrypt.hash(password, salt);

    return hash;
  }
}
