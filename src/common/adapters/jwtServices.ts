import jwt from 'jsonwebtoken'
import {IdType} from "../types/id.type";



export const jwtServices = {
    async createToken(id: string,secretKey:string,expirationTime:string): Promise<string> {
        return jwt.sign(
            {id},
            secretKey,
            {
                expiresIn: expirationTime,
            }
        );
    },
    async decodeToken(token: string) {
        try {
            return jwt.decode(token)
        } catch (e: unknown) {
            console.error("Can't decode token", e);
            return null;
        }
    },
    async verifyToken(token: string, secretKey:string): Promise<IdType | null> {
        try {
            return jwt.verify(token, secretKey) as IdType;
        } catch (error) {
            console.error("Token verify some error");
            return null;
        }
    },
}