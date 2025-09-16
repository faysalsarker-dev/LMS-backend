  async resetPassword(email: string, otp: string, newPassword: string) {
    const user = await User.findOne({ email }).select('+otp +otpExpiry');

    if (!user) throw new ApiError(404, "User not found.");
    if (!user.otp || !user.otpExpiry) throw new ApiError(400, "No pending password reset for this account.");
    if (user.otp !== otp) throw new ApiError(400, "Invalid OTP.");
    if (new Date() > user.otpExpiry) throw new ApiError(400, "OTP has expired.");

    user.password = newPassword; // The pre-save hook will hash it
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    return { message: "Password has been reset successfully." };
  },


  async forgotPassword(email: string) {
    const user = await User.findOne({ email });
    if (!user) throw new ApiError(404, "No account found with this email.");
    if (!user.isVerified) throw new ApiError(403, "Account is not verified.");

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
    await user.save({ validateBeforeSave: false }); 

    await sendEmail({
      to: user.email,
      subject: 'Your Password Reset OTP',
      html: `<p>Your password reset OTP is: <strong>${otp}</strong></p><p>It will expire in 10 minutes.</p>`,
    });

    return { message: "Password reset OTP sent to your email." };
  },


    async login(email: string, password: string) {
    const user = await User.findOne({ email }).select("+password");
    
    if (!user) throw new ApiError(401, "Invalid credentials.");
    if (!user.isVerified) throw new ApiError(403, "Account not verified. Please check your email for the verification OTP.");

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new ApiError(401, "Invalid credentials.");
    
    const accessToken = generateToken({ id: user._id, role: user.role }, config.jwt.access_expires_in);
    const refreshToken = generateToken({ id: user._id, role: user.role }, config.jwt.refresh_expires_in);
    
    return { user, accessToken, refreshToken };
  },


async verifyOtp(email: string, otp: string) {
    const user = await User.findOne({ email }).select('+otp +otpExpiry');
    
    if (!user) throw new ApiError(404, "User not found.");
    if (user.isVerified) throw new ApiError(400, "Account is already verified.");
    if (!user.otp || !user.otpExpiry) throw new ApiError(400, "No pending OTP verification for this account.");
    if (user.otp !== otp) throw new ApiError(400, "Invalid OTP.");
    if (new Date() > user.otpExpiry) throw new ApiError(400, "OTP has expired.");

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();
    
    const accessToken = generateToken({ id: user._id, ...user }, config.jwt.access_expires_in);
    const refreshToken = generateToken({ id: user._id, ...user }, config.jwt.refresh_expires_in);

    return { user, accessToken, refreshToken };
  },


  async register(data: Partial<IUser>) {
    const existingUser = await User.findOne({ email: data.email });

    if (existingUser && existingUser.isVerified) {
      throw new ApiError(400, "An account with this email already exists.");
    }
    
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    
   

     const user = new User({
            ...data,
            otp,
            otpExpiry,
            isVerified: false
        });
  
    await user.save();

    await sendEmail({
        to: user.email,
        subject: 'Verify Your Email Address',
        html: `<h1>Welcome to our platform!</h1><p>Your verification OTP is: <strong>${otp}</strong></p><p>It will expire in 10 minutes.</p>`
    });

    // We don't return the full user object to avoid leaking sensitive data
    return { email: user.email, message: "Verification OTP sent to your email." };
  },
  