import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { router } from "./app/routes";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { globalRateLimiter } from "./app/middleware/rateLimiter";
import morgan from "morgan";
import { ApiError } from "./app/errors/ApiError";

const app = express();

app.set('trust proxy', 1); 
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: [
      "https://lms.faysalsarker.me",
   "https://humanisticlanguagecenter.com", 
    "http://humanisticlanguagecenter.com",
    "http://localhost:5173"
    ],
    credentials: true,
  }),
);
app.use(morgan("dev"));

app.use(globalRateLimiter);


app.get("/api/v1", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Humanistic Language Center API is working....... check deployment pipeline",
    
  });
});

app.use("/api/v1", router);


app.use((req: Request, _res: Response, next: NextFunction) => {
  next(new ApiError(404,`Can't find ${req.originalUrl} on this server!`));
});
app.use(globalErrorHandler);

export default app;
