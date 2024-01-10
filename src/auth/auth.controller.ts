import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { authConfig } from '../utils/config';

interface AuthControllerType {
  username: string;
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() { username, password }: AuthControllerType) {
    const user = authConfig.users.find(
      ({ pass, user }) => user === username && pass === password,
    );

    if (!user)
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);

    return {
      access_token: this.authService.createToken(user.id, user.user),
    };
  }
}
