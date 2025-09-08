// import jwt, { JwtPayload, SignOptions } from "jsonwebtoken"
// import config from "../config/config"

// export const generateToken = (payload: JwtPayload, expire_in: string) => {
//     const token = jwt.sign(payload, config.jwt.secret, {
//         expiresIn: expire_in
//     } as SignOptions)
//     return token
// }





// export const verifyToken = (token: string) => {
//     const verifiedToken = jwt.verify(token, config.jwt.secret);
//     return verifiedToken
// }


// export const getTokenFromHeader = (authHeader?: string): string | null => {
//   if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
//   return authHeader.split(" ")[1];
// };


import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import config from "../config/config";

export const generateToken = (payload: JwtPayload, expiresIn: string) => {
  return jwt.sign(payload, config.jwt.secret, { expiresIn } as SignOptions);
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, config.jwt.secret);
  } catch (err) {
    return null;
  }
};

