import crypto from "crypto";
import { SessionExpired } from "../modules/auth/auth.interface";
export const generateSessionToken = (): string => {
  return crypto.randomBytes(32).toString("hex");
};


export function isSessionExpired(result: any): result is SessionExpired {
  return result && result.logout === true;
}