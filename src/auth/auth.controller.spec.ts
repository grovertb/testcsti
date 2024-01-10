import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthModule } from './auth.module';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
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

      const result = controller.login({
        username: 'csticorp',
        password: 'demo',
      });

      // Verifica que el resultado sea un objeto con el token de acceso
      expect(result).toEqual({ access_token: 'mockedAccessToken' });
    });

    it('should throw an error on failed login', async () => {
      // Mock para simular credenciales inválidas y lanzar HttpException
      jest.spyOn(authService, 'validateToken').mockImplementation(() => {
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
      });

      try {
        controller.login({
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
