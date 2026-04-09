import multer from "multer";
import { Request } from "express";
import path from "path";
import { uploadBufferToBunny } from "./bunny.config";
import { uploadBufferToAlibaba } from "./alibabaCloud.config";
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

class UniversalStorage implements multer.StorageEngine {
  private isInternational: boolean;

  constructor(isInternational: boolean = true) {
    this.isInternational = isInternational;
  }

  _handleFile(
    req: Request,
    file: Express.Multer.File,
    cb: (error?: any, info?: Partial<Express.Multer.File>) => void
  ): void {
    const chunks: Buffer[] = [];

    file.stream.on("data", (chunk) => {
      chunks.push(chunk as Buffer);
    });

    file.stream.on("error", (error) => cb(error));

    file.stream.on("end", async () => {
      try {
        const buffer = Buffer.concat(chunks);
        const destinationPath = buildDestinationPath(file);

        let publicUrl: string;

        // Route to appropriate provider based on isInternational flag
        if (this.isInternational) {
          publicUrl = await uploadBufferToBunny(buffer, destinationPath, file.mimetype);
        } else {
          publicUrl = await uploadBufferToAlibaba(buffer, destinationPath, file.mimetype);
        }


        console.log(`upload returned URL: ${publicUrl}`);
        cb(null, {
          buffer,
          size: buffer.length,
          path: publicUrl,
          destination: this.isInternational ? "bunny" : "alibaba",
          filename: destinationPath,
        });
      } catch (error) {
        cb(error);
      }
    });
  }

  _removeFile(
    req: Request,
    file: Express.Multer.File & { destination?: string },
    cb: (error: Error | null) => void
  ): void {
    // Optional: implement file deletion logic if needed
    cb(null);
  }
}

export default UniversalStorage;
