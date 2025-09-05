import jwt, { JwtPayload, SignOptions } from "jsonwebtoken"
import config from "../config/config"






export const generateToken = (payload: JwtPayload, secret: string, expiresIn: string) => {
    const token = jwt.sign(payload, secret, {
        expiresIn
    } as SignOptions)

    return token
}





export const verifyToken = (token: string) => {
    const verifiedToken = jwt.verify(token, config.jwt.secret);
    return verifiedToken
}



