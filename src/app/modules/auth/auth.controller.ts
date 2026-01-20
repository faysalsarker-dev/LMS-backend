import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { userService } from "./auth.service";
import sendResponse from "../../utils/sendResponse";
import { setCookie } from './../../utils/setCookie';
import { ApiError } from "../../errors/ApiError";


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


  logout: catchAsync(async (_req: Request, res: Response) => {

    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    })
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    })


    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Logged out successfully",
    });
  }),


me: catchAsync(async (req: Request, res: Response) => {
 
    const userId = req.user._id.toString();
    const { courses, wishlist } = req.query;

    const result = await userService.getMe(
      userId,
      courses === 'true',
      wishlist === 'true'
    );

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Your profile retrieved successfully",
      data: result,
    });
  
}),



sendOtp: catchAsync(async (req: Request, res: Response) => {
  const email = req.body.email;
  const result = await userService.sendOtp(email);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "OTP Send Successfully",
    data: result
  });
}),


addToWishlist: catchAsync(async (req: Request, res: Response) => {
 const id = req.user._id
 const result = await userService.addToWishlist(id,req.body.courseId)


    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Logged out successfully",
      data:result
    });
  }),


verifyOtp: catchAsync(async (req: Request, res: Response) => {
  const {email,otp} = req.body;
 const result = await userService.verifyOtp(email,otp);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Your Account Verify Successfully",
    data: result
  });
}),


forgetPassword: catchAsync(async (req: Request, res: Response) => {
  const {email} = req.body;
  const result = await userService.forgotPassword(email);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Password reset link sent to email",
    data: result
  });
}),

resetPassword: catchAsync(async (req: Request, res: Response) => {
const { id, token, newPassword } = req.body;
const result = await userService.resetPassword(id,token,newPassword);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Your profile Retrieved Successfully",
    data: result
  });
}),



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

  updatePassword: catchAsync(async (req: Request, res: Response) => {
    const userId = req.user._id;


    const user = await userService.updatePassword(userId, req.body);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Password updated successfully",
      data: user,
    });
  }),
  
  updateProfile: catchAsync(async (req: Request, res: Response) => {
    const userId = req.user._id;


    console.log(userId)
    const payload ={
      ...req.body,
      profile:req.file?.path
    }

  if (payload.address) {
    try {
      payload.address = JSON.parse(payload.address);
    } catch {
      throw new ApiError(400, "Invalid address format");
    }
  }
    const user = await userService.updateProfile(userId,payload);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  }),


  updateUser: catchAsync(async (req: Request, res: Response) => {
    const userId = req.params.id;
    const payload = req.body;
    const user = await userService.updateUser(userId,payload);

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

  getAll: catchAsync(async (req: Request, res: Response) => {
    const result = await userService.getAll(req);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Users fetched successfully",
      data: result,
  
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
