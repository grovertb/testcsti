import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { HttpException, HttpStatus } from '@nestjs/common';

import { createTestingModuleWithDB } from '../../utils/test-utils';
import { AuthController } from './auth.controller';
import { AuthModule } from './auth.module';
import { AuthService } from './auth.service';
import { User } from '../../entities/user.entity';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AuthModule,
        createTestingModuleWithDB(),
        TypeOrmModule.forFeature([User]),
      ],
      controllers: [AuthController],
      providers: [AuthService, JwtService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return an access token on successful login', async () => {
      jest
        .spyOn(authService, 'createToken')
        .mockReturnValue('mockedAccessToken');

      const result = await controller.login({
        username: 'csticorp',
        password: 'demo',
      });

      expect(result).toEqual({ access_token: 'mockedAccessToken' });
    });

    it('should throw an error on failed login', async () => {
      try {
        await controller.login({
          username: 'testuser',
          password: 'testpassword',
        });
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toEqual('Invalid credentials');
        expect(error.getStatus()).toBe(HttpStatus.UNAUTHORIZED);
      }
    });
  });
});
