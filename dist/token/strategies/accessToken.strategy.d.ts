import { Strategy } from 'passport-jwt';
import { Request } from 'express';
type JwtPayload = {
    sub: string;
    phoneNumber: string;
};
declare const AccessTokenStrategy_base: new (...args: any[]) => Strategy;
export declare class AccessTokenStrategy extends AccessTokenStrategy_base {
    constructor();
    validate(req: Request, payload: JwtPayload): {
        accessToken: string;
        sub: string;
        phoneNumber: string;
    };
}
export {};
