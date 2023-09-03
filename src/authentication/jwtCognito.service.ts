import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtCognitoService {
  private verifier: CognitoJwtVerifier<any, any, any>;

  constructor(private readonly configService: ConfigService) {
    this.verifier = CognitoJwtVerifier.create({
      userPoolId: this.awsUserPoolId,
      tokenUse: 'access',
      clientId: this.awsUserPoolAppClientId,
    });

    this.verifier.hydrate();
  }

  async verifyUserJwt(jwtToken: string) {
    try {
      const payload = await this.verifier.verify(jwtToken, { groups: 'admin' });
      return payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid JWT token');
    }
  }

  get awsUserPoolId(): string {
    return this.configService.get('AWS_USER_POOL_ID') ?? '';
  }

  get awsUserPoolAppClientId(): string {
    return this.configService.get('AWS_USER_POOL_APP_CLIENT_ID') ?? '';
  }
}
