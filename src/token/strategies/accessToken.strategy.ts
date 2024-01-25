import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as process from 'process';
type JwtPayload = {
  sub: string;
  phoneNumber: string;
};
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  // TODO make use of config service
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ACCESS_SECRET,
    });
  }
  validate(payload: JwtPayload) {
    return payload;
  }
}
