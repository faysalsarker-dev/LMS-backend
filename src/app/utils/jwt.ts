


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

