import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';

import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let usersService: UsersService;
  const getUserByMock = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: {
            getUserBy: getUserByMock,
          },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
  });
  describe('when the getUserByEmail function is called', () => {
    describe('and the getUserBy method returns the user', () => {
      let user: User;
      beforeEach(() => {
        user = {
          id: '1',
          name: 'john',
          email: 'john@smith.com',
          password: 'StrongPassword1!',
          creationDate: new Date(),
          currentHashedRefreshToken: null,
        };
        getUserByMock.mockResolvedValue(user);
      });

      it('should return the user', async () => {
        const result = await usersService.getUserByEmail(user.email);
        expect(result).toBe(user);
      });
    });
    describe('and the getUserBy method does nor return user', () => {
      beforeEach(() => {
        getUserByMock.mockImplementation(() => {
          throw new HttpException('error', 400);
        });
      });
      it('should throw the Exception', async () => {
        return expect(async () => {
          await usersService.getUserByEmail('wrongAddress');
        }).rejects.toThrow(HttpException);
      });
    });
  });
});
