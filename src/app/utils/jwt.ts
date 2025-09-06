import jwt, { JwtPayload, SignOptions } from "jsonwebtoken"
import config from "../config/config"

<<<<<<< HEAD





export const generateToken = (payload: JwtPayload, secret: string, expiresIn: string) => {
    const token = jwt.sign(payload, secret, {
        expiresIn
    } as SignOptions)

=======
export const generateToken = (payload: JwtPayload) => {
    const token = jwt.sign(payload, config.jwt.secret, {
        expiresIn: config.jwt.expires_in
    } as SignOptions)
>>>>>>> fedc3050a18211aa344df31033e10b69784ae83a
    return token
}





<<<<<<< HEAD
export const verifyToken = (token: string) => {
    const verifiedToken = jwt.verify(token, config.jwt.secret);
    return verifiedToken
}



=======





export const verifyToken = (token: string) => {
    const verifiedToken = jwt.verify(token, config.jwt.secret);
    return verifiedToken
}
>>>>>>> fedc3050a18211aa344df31033e10b69784ae83a
