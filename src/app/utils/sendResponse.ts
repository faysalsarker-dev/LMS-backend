import { Response } from 'express';

interface ResponsePayload<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T | null;
  meta?:any | null
  
}

const sendResponse = <T>(res: Response, payload: ResponsePayload<T>) => {
  res.status(payload.statusCode).json({
    success: payload.success,
    message: payload.message,
    data: payload.data ?? null,
    meta:payload.meta ?? null
   
  });
};

export default sendResponse;
