import multer from "multer";
import { Request } from "express";
import path from "path";
import { uploadBufferToBunny } from "./bunny.config";
import { ApiError } from "../errors/ApiError";

const sanitizeFileName = (name: string) =>
  name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/\./g, "-")
    .replace(/[^a-z0-9\-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const getFolderForField = (fieldname: string, mimetype: string) => {
  if (fieldname === "video") return "videos";
  if (fieldname === "audio" || fieldname === "audioFile") return "audio";
  if (mimetype.startsWith("image/")) return "images";
  return "uploads";
};

const buildDestinationPath = (file: Express.Multer.File): string => {
  const extension = path.extname(file.originalname) || "";
  const baseName = sanitizeFileName(path.basename(file.originalname, extension));
  const folder = getFolderForField(file.fieldname, file.mimetype);
  const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}-${baseName}${extension}`;
  return `${folder}/${uniqueName}`;
};

class BunnyStorage implements multer.StorageEngine {
  _handleFile(req: Request, file: Express.Multer.File, cb: (error?: any, info?: Partial<Express.Multer.File>) => void): void {
    const chunks: Buffer[] = [];

    file.stream.on("data", (chunk) => {
      chunks.push(chunk as Buffer);
    });

    file.stream.on("error", (error) => cb(error));

    file.stream.on("end", async () => {
      try {
        const buffer = Buffer.concat(chunks);
        const destinationPath = buildDestinationPath(file);
        const publicUrl = await uploadBufferToBunny(buffer, destinationPath, file.mimetype);

        cb(null, {
          buffer,
          size: buffer.length,
          path: publicUrl,
          filename: destinationPath,
          mimetype: file.mimetype,
        });
      } catch (error: any) {
        cb(new ApiError(500, `Failed to upload file to Bunny.net: ${error.message}`));
      }
    });
  }

  _removeFile(req: Request, file: Express.Multer.File, cb: (error: Error | null) => void): void {
    cb(null);
  }
}

const bunnyStorage = new BunnyStorage();

export const multerUpload = multer({ storage: bunnyStorage });

export const multerVideoUpload = multer({
  storage: bunnyStorage,
  limits: {
    fileSize: 300 * 1024 * 1024,
  },
});
