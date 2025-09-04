import jwt, { JwtPayload, SignOptions } from "jsonwebtoken"
import config from "../config/config"

export const generateToken = (payload: JwtPayload) => {
    const token = jwt.sign(payload, config.jwt.secret, {
        expiresIn: config.jwt.expires_in
    } as SignOptions)
    return token
}










export const verifyToken = (token: string) => {
    const verifiedToken = jwt.verify(token, config.jwt.secret);
    return verifiedToken
}