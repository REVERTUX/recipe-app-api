import { BadRequestException, HttpException } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { UsersService } from 'src/users/users.service';
import { AuthenticationService } from './authentication.service';

describe('AuthenticationService', () => {
  let authenticationService: AuthenticationService;
  let password: string;
  let getUserPasswordByEmailMock: jest.Mock;
  let getUserWithPasswordByEmailMock: jest.Mock;

  beforeEach(async () => {
    jest.resetModules();
    getUserPasswordByEmailMock = jest.fn();
    getUserWithPasswordByEmailMock = jest.fn();

    const module = await Test.createTestingModule({
      providers: [
        AuthenticationService,
        {
          provide: UsersService,
          useValue: {
            getUserPasswordByEmail: getUserPasswordByEmailMock,
            getUserWithPasswordByEmail: getUserWithPasswordByEmailMock,
          },
        },
      ],
      imports: [
        ConfigModule.forRoot(),
        JwtModule.register({ secretOrPrivateKey: 'Secret key' }),
      ],
    }).compile();

    authenticationService = await module.get(AuthenticationService);
  });

  describe('when calling the getCookieForLogOut method', () => {
    it('should return a correct array', () => {
      const result = authenticationService.getCookiesForLogOut();
      expect(result).toStrictEqual([
        'Authentication=; HttpOnly; Path=/; Max-Age=0',
        'Refresh=; HttpOnly; Path=/; Max-Age=0',
      ]);
    });
  });
  describe('when the getAuthenticatedUser method is called', () => {
    describe('and a valid email and password are provided', () => {
      let userData: User;
      beforeEach(async () => {
        password = 'strongPassword!!1';
        const hashedPassword = await bcrypt.hash(password, 10);
        userData = {
          id: '1',
          email: 'test@mail.com',
          name: 'test',
          password: hashedPassword,
          creationDate: new Date(),
          currentHashedRefreshToken: null,
        };
        getUserPasswordByEmailMock.mockResolvedValue({
          password: hashedPassword,
        });
        getUserWithPasswordByEmailMock.mockResolvedValue(userData);
      });
      it('should return the new user', async () => {
        const result = await authenticationService.getAuthenticatedUser(
          userData.email,
          password,
        );
        expect(result).toBe(userData);
      });
    });

    describe('and a valid email and password are provided', () => {
      beforeEach(() => {
        getUserPasswordByEmailMock.mockRejectedValue(new BadRequestException());
      });
      it('should throw the BadRequestException', async () => {
        return expect(async () => {
          await authenticationService.getAuthenticatedUser(
            'wrong@email.com',
            password,
          );
        }).rejects.toThrow(HttpException);
      });
    });
  });
});
