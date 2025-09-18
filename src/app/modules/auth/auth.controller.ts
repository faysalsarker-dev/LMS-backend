import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { userService } from "./auth.service";
import sendResponse from "../../utils/sendResponse";
import { setCookie } from './../../utils/setCookie';


export const AuthController = {


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
    const { email, password ,remember } = req.body;   
    const { user, accessToken, refreshToken } = await userService.login(
      email,
      password,
      Boolean(remember)
      
    );

    setCookie(res, accessToken , refreshToken );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Login successful",
      data:  user ,
    });
  }),


  logout: catchAsync(async (req: Request, res: Response) => {
    // const userId = req.user.id; 
    // await userService.logout(userId);


    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })


    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Logged out successfully",
    });
  }),


me: async (req: Request, res: Response) => {
  const decodedToken = req.user._id;
  const result = await userService.getMe(decodedToken);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Your profile Retrieved Successfully",
    data: result
  });
},

sendOtp: async (req: Request, res: Response) => {
  const email = req.body.email;
  const result = await userService.sendOtp(email);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "OTP Send Successfully",
    data: result
  });
},

verifyOtp: async (req: Request, res: Response) => {
  const {email,otp} = req.body;
  const result = await userService.verifyOtp(email,otp);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Your Account Verify Successfully",
    data: result
  });
},


forgetPassword: async (req: Request, res: Response) => {
  const {email} = req.body;
  const result = await userService.forgotPassword(email);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Your profile Retrieved Successfully",
    data: result
  });
},

resetPassword: async (req: Request, res: Response) => {
const { id, token, newPassword } = req.body;
const result = await userService.resetPassword(id,token,newPassword);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Your profile Retrieved Successfully",
    data: result
  });
},



  getNewAccessToken: catchAsync(async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
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
    const userId = req.user._id;
    const payload ={
      ...req.body,
      profile:req.file?.path
    }
    const user = await userService.updateProfile(userId,payload);

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
