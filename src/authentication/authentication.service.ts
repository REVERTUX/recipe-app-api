import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
} from 'amazon-cognito-identity-js';

import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './register';
import { TokenPayload } from './tokenPayload.interface';
import { error } from 'console';
// import {
//   AdminCreateUserCommand,
//   AdminCreateUserCommandInput,
//   AdminGetUserCommand,
//   CognitoIdentityProviderClient,
// } from '@aws-sdk/client-cognito-identity-provider';
// import {
//   CognitoIdentityClient,
//   CreateIdentityPoolCommand,
// } from '@aws-sdk/client-cognito-identity';

@Injectable()
export class AuthenticationService {
  private userPool: CognitoUserPool;
  // private cognitoClient: CognitoIdentityProviderClient;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.userPool = new CognitoUserPool({
      UserPoolId: this.awsUserPoolId,
      ClientId: this.awsUserPoolAppClientId,
    });
    // this.cognitoClient = new CognitoIdentityProviderClient({
    //   region: this.awsRegion,
    // });
    // const command = new AdminCreateUserCommand({})
    // const command = new AdminGetUser();
  }

  public async register(registrationData: RegisterDto) {
    const { name, email, password } = registrationData;

    try {
      const data = await new Promise((resolve, reject) => {
        return this.userPool.signUp(
          name,
          password,
          [
            new CognitoUserAttribute({ Name: 'email', Value: email }),
            new CognitoUserAttribute({ Name: 'nickname', Value: name }),
          ],
          [],
          (err, result) => {
            if (!result) {
              reject(err);
            } else {
              resolve(result.user);
            }
          },
        );
      });
      return data;

      // const user = await data;
      // return user;
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === 'InvalidParameterException') {
          throw new BadRequestException('Invalid body request');
        }
        if (error.name === 'UsernameExistsException') {
          throw new BadRequestException('Username already used');
        }
        if (error.name === 'UserLambdaValidationException') {
          throw new BadRequestException('Email already used');
        }
        throw new BadRequestException(error.message);
      }
    }
    throw new BadRequestException('Error on user creation');
    // }
    // .then((data) => {
    //   return data;
    // })
    // .catch((error) => {
    //   throw new BadRequestException('Email already used');
    // });
    // if (data?.error) {
    //   throw new BadRequestException('Email already used');
    // }
    // .catch((error: any) => {
    //   console.log(error)
    //   // if (error.message == 'UserLambdaValidationException') {
    //     throw new BadRequestException('Email already used');

    //   // }
    // });
    // const hashedPassword = await bcrypt.hash(registrationData.password, 10);

    // const createdUser = await this.usersService.create({
    //   ...registrationData,
    //   password: hashedPassword,
    // });
    // return createdUser;
  }

  async getAuthenticatedUser(email: string, plainTextPassword: string) {
    try {
      const { password } = await this.usersService.getUserPasswordByEmail(
        email,
      );

      await this.verifyPassword(plainTextPassword, password);

      const user = await this.usersService.getUserWithPasswordByEmail(email);

      return user;
    } catch (error) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  getCookieWithJwtAccessToken(userId: string) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
    });
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${
      this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME') ?? 1200
    }`;
  }

  getCookieWithJwtRefreshToken(userId: string) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${
        this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME') ?? 2592000
      }s`,
    });
    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${
      this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME') ?? 2592000
    }`;
    return {
      cookie,
      token,
    };
  }

  getCookiesForLogOut() {
    return [
      'Authentication=; HttpOnly; Path=/; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; Max-Age=0',
    ];
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );
    if (!isPasswordMatching) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  get awsRegion(): string {
    return this.configService.get('AWS_REGION') ?? '';
  }

  get awsUserPoolId(): string {
    return this.configService.get('AWS_USER_POOL_ID') ?? '';
  }

  get awsUserPoolAppClientId(): string {
    return this.configService.get('AWS_USER_POOL_APP_CLIENT_ID') ?? '';
  }
}
