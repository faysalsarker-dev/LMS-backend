import { model, Schema } from "mongoose";
import { IUser } from "./auth.interface";
import  bcrypt  from 'bcryptjs';

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    phone: {
      type: String,
      required: true,
      match: [/^\+?[0-9]{7,15}$/, "Invalid phone number"],
    },
    password: { type: String, required: true, minlength: 6 , select: false},
    role: {
      type: String,
      enum: ["student", "instructor", "admin","super_admin"],
      default: "student",
    },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    profile: { type: String ,default:null},
courses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
    // otp: { type: String, select: false },
    // otpExpiry: { type: Date, select: false },
    // lastLogin: { type: Date, default: null },

    // currentSession: {
    //   tokenId: { type: String, default: null },
    //   device: { type: String, default: null },
    //   lastLogin: { type: Date, default: null },
    // },

  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = model<IUser>("User", userSchema);
export default User;