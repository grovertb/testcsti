import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule, JwtService } from '@nestjs/jwt';

import { authConfig } from '../utils/config';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { AuthModule } from './auth.module';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: authConfig.jwtSecret,
          signOptions: { expiresIn: '1h' },
        }),
        AuthModule,
      ],
      providers: [AuthService, JwtService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createToken', () => {
    it('should return a valid JWT token', () => {
      const userId = 1;
      const username = 'csticorp';

      const token = service.createToken(userId, username);

      expect(token).toBeTruthy();

      // Verifica que el token sea válido usando el servicio JwtService
      const decoded = jwtService.verify(token);
      expect(decoded.userId).toBe(userId);
      expect(decoded.username).toBe(username);
    });
  });

  describe('validateToken', () => {
    it('should return decoded data for a valid token', () => {
      const userId = 1;
      const username = 'testuser';
      const token = jwtService.sign({ userId, username });

      const decoded = service.validateToken(token);

      expect(decoded).toBeTruthy();
      expect(decoded.userId).toBe(userId);
      expect(decoded.username).toBe(username);
    });

    it('should throw UnauthorizedException for an invalid token', () => {
      const invalidToken = 'invalid_token';

      expect(() => service.validateToken(invalidToken)).toThrowError(
        UnauthorizedException,
      );
    });
  });
});
