/* eslint-disable prettier/prettier */
import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { generateRandomPassword } from '../utils/generate-pw';
import { ChangePasswordDto } from './dto/changePass-user.dto';
import { ForgetPassUserDto } from './dto/forgetPass-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private JwtService: JwtService,
    private configService: ConfigService,
    private mailerService: MailerService,
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

  async forgetPass(forgetPassUser: ForgetPassUserDto): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email: forgetPassUser.email },
    });
    if (!user) {
      throw new HttpException('Email is not exist', HttpStatus.UNAUTHORIZED);
    }
    // Tạo mật khẩu ngẫu nhiên
    const newPassword = generateRandomPassword(10);
    // Hash mật khẩu mới
    const hashPassword = await this.hashPassword(newPassword);

    user.password = hashPassword;
    await this.userRepository.save(user);

    await this.mailerService.sendMail({
      to: user.email,
      from: 'Long châu',
      subject: 'Long Chau Management',
      html: `
      <div style="background-color: #f5f5f5; padding: 20px;">
      <div style="background-color: #ffffff; padding: 20px; border-radius: 5px;">
        <img src="https://bizweb.dktcdn.net/100/324/196/files/long-chau-399x266.jpg?v=1571028848658" alt="Logo" style="display: block; margin: 0 auto; width: 200px;">
        <h2 style="text-align: center; color: #333333; margin-top: 20px;">Khôi phục mật khẩu</h2>
        <p style="text-align: center; color: #666666;">Xin chào <b>${user.first_name} ${user.last_name}</b>,</p>
        <p style="text-align: center; color: #666666;">Bạn đã yêu cầu khôi phục mật khẩu. Dưới đây là mật khẩu mới của bạn:</p>
        <h3 style="text-align: center; color: #333333; margin-top: 20px; padding: 10px; background-color: #eeeeee; border-radius: 5px;">Mật khẩu: ${newPassword}</h3>
        <p style="text-align: center; color: #666666;">Vui lòng sử dụng mật khẩu mới này để đăng nhập và tiến hành đổi mật khẩu khi đăng nhập thành công!</p>
        <p style="text-align: center; color: #666666;">Nếu bạn không yêu cầu khôi phục mật khẩu, hãy bỏ qua email này.</p>
        <p style="text-align: center; color: #666666;">Trân trọng!</p>
      </div>
    </div>
  `,
    });
    return 'Password recovery successful. Please check your email for a new password.';
  }

  async changePassword(changePassword: ChangePasswordDto): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email: changePassword.email },
    });
    if (!user) {
      throw new HttpException('Email is not exist', HttpStatus.UNAUTHORIZED);
    }
    const checkPass = bcrypt.compareSync(
      changePassword.password,
      user.password,
    );

    if (!checkPass) {
      throw new HttpException(
        'Password is not correct !',
        HttpStatus.UNAUTHORIZED,
      );
    }
    // Hash mật khẩu mới
    const hashPassword = await this.hashPassword(changePassword.newPassword);
    user.password = hashPassword;
    await this.userRepository.save(user);

    return new HttpException('Change Password successfully !', HttpStatus.OK);
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
  async getAuthUser(userId: number): Promise<User> {
    return await this.userRepository.findOneBy({ id: userId });
  }
}
