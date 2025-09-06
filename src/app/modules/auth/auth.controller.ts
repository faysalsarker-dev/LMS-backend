import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { userService } from "./auth.service";
import sendResponse from "../../utils/sendResponse";
import { setCookie } from "../../utils/setCookie";


export const userController = {
  register: catchAsync(async (req: Request, res: Response) => {
    const user = await userService.register(req.body);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User registered successfully",
      data: user,
    });
  }),

  login: catchAsync(async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const ip = req.ip;
    const userAgent = req.headers["user-agent"] || "";

    const { user, accessToken, refreshToken } = await userService.login(
      username,
      password,
      ip,
      userAgent
    );

    setCookie(res, accessToken);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Login successful",
      data: { user, accessToken, refreshToken },
    });
  }),

  logout: catchAsync(async (req: Request, res: Response) => {
    const userId = req.user.id; // from auth middleware
    await userService.logout(userId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Logged out successfully",
    });
  }),

  refreshToken: catchAsync(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const { accessToken } = await userService.refreshToken(refreshToken);

    setCookie(res, accessToken);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Token refreshed successfully",
      data: { accessToken },
    });
  }),

  updateProfile: catchAsync(async (req: Request, res: Response) => {
    const userId = req.user.id;
    const user = await userService.updateProfile(userId, req.body);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  }),

  getUser: catchAsync(async (req: Request, res: Response) => {
    const user = await userService.getUserById(req.params.id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  }),

  deleteUser: catchAsync(async (req: Request, res: Response) => {
    await userService.deleteUser(req.params.id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User deleted successfully",
    });
  }),
};
