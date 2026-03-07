import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorConverter from "./app/errors/errorConverter";
import errorHandler from "./app/middleware/errorHandler.middleware";
import { router } from "./app/routes";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { globalRateLimiter } from "./app/middleware/rateLimiter";
import morgan from "morgan";

const app = express();

app.enable('trust proxy');
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: [
      "https://lms-web-app-sigma.vercel.app",
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
    message: "api is working.....",
  });
});

app.use("/api/v1", router);



app.use(globalErrorHandler);
app.use(errorConverter);
app.use(errorHandler);

export default app;
