import { Response } from "express";



export const setCookie = (res: Response, accessToken: string) => {
    if (accessToken) {
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none"
        })
    }

}