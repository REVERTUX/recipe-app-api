import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { UsersService } from 'src/users/users.service';
import { UsersRepository } from 'src/users/users.repository';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LocalStrategy } from './local.strategy';

describe('AuthenticationController', () => {
  let createUserMock: jest.Mock;
  let getUserPasswordByMock: jest.Mock;
  let getUserWithPasswordByMock: jest.Mock;
  let updateRefreshTokenMock: jest.Mock;
  let app: INestApplication;
  beforeEach(async () => {
    createUserMock = jest.fn();
    getUserPasswordByMock = jest.fn();
    getUserWithPasswordByMock = jest.fn();
    updateRefreshTokenMock = jest.fn();

    const module = await Test.createTestingModule({
      providers: [
        AuthenticationService,
        UsersService,
        LocalStrategy,
        {
          provide: UsersRepository,
          useValue: {
            createUser: createUserMock,
            getUserPasswordBy: getUserPasswordByMock,
            getUserWithPasswordBy: getUserWithPasswordByMock,
            updateRefreshToken: updateRefreshTokenMock,
          },
        },
      ],
      controllers: [AuthenticationController],
      imports: [
        ConfigModule.forRoot(),
        JwtModule.register({ secretOrPrivateKey: 'Secret key' }),
      ],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
  });

  describe('when the /register endpoint is called', () => {
    describe('and valid data is provided', () => {
      let user: CreateUserDto;
      beforeEach(async () => {
        user = {
          name: 'john',
          email: 'john@smith.com',
          password: 'StrongPassword1!',
        };
      });

      describe('and the user is successfully created in the database', () => {
        beforeEach(() => {
          createUserMock.mockResolvedValue({
            name: user.name,
            email: user.email,
          });
        });
        it('should return the new user without the password', async () => {
          return request(app.getHttpServer())
            .post('/authentication/register')
            .send(user)
            .expect({ name: user.name, email: user.email });
        });
      });

      describe('and the email is already taken', () => {
        beforeEach(async () => {
          createUserMock.mockImplementation(() => {
            throw new Prisma.PrismaClientKnownRequestError(
              'the user already exist',
              { code: 'P2002', clientVersion: '4.12.0' },
            );
          });
        });
        it('should result in 409 Conflict', () => {
          return request(app.getHttpServer())
            .post('/authentication/register')
            .send({
              name: user.name,
              email: user.email,
              password: user.password,
            })
            .expect(409);
        });
      });
    });
    describe('and the email is missing', () => {
      it('should result in 400 Bad Request', () => {
        return request(app.getHttpServer())
          .post('/authentication/register')
          .send({
            name: 'John',
            password: 'StrongPassword1!',
          })
          .expect(400);
      });
    });

    describe('and the name is missing', () => {
      it('should result in 400 Bad Request', () => {
        return request(app.getHttpServer())
          .post('/authentication/register')
          .send({
            email: 'john@smith.com',
            password: 'StrongPassword1!',
          })
          .expect(400);
      });
    });

    describe('and the password is missing', () => {
      it('should result in 400 Bad Request', () => {
        return request(app.getHttpServer())
          .post('/authentication/register')
          .send({
            email: 'john@smith.com',
            name: 'John',
          })
          .expect(400);
      });
    });
  });
  describe('when /log-in endpoint is called', () => {
    describe('and valid data is provided', () => {
      const user = { email: 'john@smith.com', password: 'StrongPassword1!' };
      beforeEach(async () => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        getUserPasswordByMock.mockResolvedValue({ password: hashedPassword });
        getUserWithPasswordByMock.mockResolvedValue({
          name: 'john',
          email: 'john@smith.com',
        });
      });

      it('should successfully login', async () => {
        const res = await request(app.getHttpServer())
          .post('/authentication/log-in')
          .send(user);
        expect(res.statusCode).toBe(200);
      });
      it('should have proper cookies values', async () => {
        const res = await request(app.getHttpServer())
          .post('/authentication/log-in')
          .send(user);

        const authenticationCookie = res.header['set-cookie'][0];
        const refreshCookie = res.header['set-cookie'][1];

        expect(authenticationCookie).toContain(
          'Authentication=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.',
        );
        expect(authenticationCookie).toContain(
          'HttpOnly; Path=/; Max-Age=1200',
        );

        expect(refreshCookie).toContain(
          'Refresh=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.',
        );
        expect(refreshCookie).toContain('HttpOnly; Path=/; Max-Age=259200');
      });
    });
  });
});
