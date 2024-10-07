import {appConfig} from "../settings/config";
import jwt from 'jsonwebtoken'
import {IdType} from "../types/id.type";



export const jwtServices = {
    async createToken(id: string): Promise<string> {
        return jwt.sign(
            {id},
            appConfig.AT_SECRET,
            {
                expiresIn: appConfig.AT_TIME,
            }
        );
    },
    async decodeToken(token: string): Promise<any> {
        try {
            return jwt.decode(token);
        } catch (e: unknown) {
            console.error("Can't decode token", e);
            return null;
        }
    },
    async verifyToken(token: string): Promise<IdType | null> {
        try {
            return jwt.verify(token, appConfig.AT_SECRET) as IdType;
        } catch (error) {
            console.error("Token verify some error");
            return null;
        }
    },
}