import crypto from 'crypto';

export const generateTransactionId = () => {
  const brand = "HLC";
  const randomStr = crypto.randomBytes(3).toString('hex').toUpperCase();
  const date = new Date();
  const timestamp = date.getTime().toString().slice(-4); 
  return `${brand}-${randomStr}-${timestamp}`;
};