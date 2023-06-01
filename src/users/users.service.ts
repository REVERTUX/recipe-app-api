import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private repository: UsersRepository) {}

  private readonly logger = new Logger(UsersService.name);

  async create(createUserDto: CreateUserDto) {
    this.logger.log(`Creating user ${createUserDto.name}`);

    const data = await this.repository.createUser({
      data: createUserDto,
      select: { id: true, email: true, name: true },
    });

    this.logger.log(`Created user ${createUserDto.name}`);

    return data;
  }

  async getUserByEmail(email: string) {
    try {
      return await this.repository.getUserBy({
        where: { email },
      });
    } catch (error) {
      throw new HttpException(
        'User with this email does not exist',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async getUserWithPasswordByEmail(email: string) {
    try {
      return await this.repository.getUserWithPasswordBy({
        where: { email },
      });
    } catch (error) {
      throw new HttpException(
        'User with this email does not exist',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async getUserPasswordByEmail(email: string) {
    try {
      return await this.repository.getUserPasswordBy({
        where: { email },
      });
    } catch (error) {
      throw new HttpException(
        'User with this email does not exist',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async getUserById(id: string) {
    try {
      return await this.repository.getUserBy({
        where: { id },
      });
    } catch (error) {
      throw new HttpException(
        'User with this id does not exist',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async setCurrentRefreshToken(refreshToken: string, userId: string) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.repository.updateRefreshToken(currentHashedRefreshToken, userId);
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: string) {
    const user = await this.getUserById(userId);

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken || '',
    );

    if (!isRefreshTokenMatching) {
      throw new HttpException(
        'Refresh token not match',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return user;
  }

  async removeRefreshToken(userId: string) {
    return this.repository.updateRefreshToken(null, userId);
  }
}
