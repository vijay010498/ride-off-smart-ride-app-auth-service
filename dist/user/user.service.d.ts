/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { Model } from 'mongoose';
import { UserDocument } from './user.schema';
import { UpdateTokensDto } from './dtos/update-tokens.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserTokenBlacklistDocument } from './user-token-blacklist.schema';
export declare class UserService {
    private readonly userCollection;
    private readonly UserTokenBlacklistCollection;
    constructor(userCollection: Model<UserDocument>, UserTokenBlacklistCollection: Model<UserTokenBlacklistDocument>);
    getUserByPhone(phoneNumber: string): Promise<import("mongoose").Document<unknown, {}, UserDocument> & import("./user.schema").User & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    createUserByPhone(phoneNumber: string): Promise<import("mongoose").Document<unknown, {}, UserDocument> & import("./user.schema").User & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    findById(id: string): Promise<import("mongoose").Document<unknown, {}, UserDocument> & import("./user.schema").User & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    update(id: string, updateUserDto: Partial<UpdateTokensDto> | UpdateTokensDto | UpdateUserDto | Partial<UpdateUserDto>): Promise<import("mongoose").Document<unknown, {}, UserDocument> & import("./user.schema").User & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    logout(userId: string, accessToken: string): Promise<void>;
    tokenInBlackList(accessToken: string): Promise<import("mongoose").Document<unknown, {}, UserTokenBlacklistDocument> & import("./user-token-blacklist.schema").UserTokenBlacklist & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}
