import { Schema, model } from "mongoose";
import { IAppConfig } from "./app.interface";



const appConfigSchema = new Schema<IAppConfig>(
  {
   
    cloudinary: {
      cloudName: { type: String },
      apiKey: { type: String },
      apiSecret: { type: String },
    },

    smtp: {
      host: { type: String },
      port: { type: Number },
      user: { type: String },
      pass: { type: String },
    },

    jwt: {
      accessExpiresIn: { type: String },
      refreshExpiresIn: { type: String },
    },

    frontendUrl: { type: String },

  },
  { timestamps: true }
);

const AppConfig = model<IAppConfig>("AppConfig", appConfigSchema);
export default AppConfig;
