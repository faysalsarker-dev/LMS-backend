import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import errorConverter from './app/errors/errorConverter';
import errorHandler from './app/middleware/errorHandler.middleware';
import { router } from './app/routes';
import { globalErrorHandler } from './app/middleware/globalErrorHandler';



const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(cors({ origin: ["https://lms-web-app-sigma.vercel.app","http://localhost:5173","https://lms.bonikjewellers.com" , "http://192.168.0.127:5173"], credentials: true }));

// app.use((req: Request, res: Response, next) => {
//   const timestamp = new Date().toISOString();
//   console.log(`[${timestamp}] ${req.method} ${req.path}`);
//   next();
// });


app.use("/api/v1", router)

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
       message:"api is working....."
    })
})







app.use(globalErrorHandler);
app.use(errorConverter);
app.use(errorHandler);

export default app;
