import { UserI } from './userI';

export interface UserTokenI {
    user: UserI;
    accessToken: string;
    expiresIn?: number;
    expireDate?: Date;
}
