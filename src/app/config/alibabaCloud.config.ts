import OSS from "ali-oss";
import config from "./config";
import { ApiError } from "../errors/ApiError";

// Initialize Alibaba Cloud OSS client
const client = new OSS({
  region: config.alibabaCloud.region,
  accessKeyId: config.alibabaCloud.accessKeyId,
  accessKeySecret: config.alibabaCloud.accessKeySecret,
  bucket: config.alibabaCloud.bucket,
});

/**
 * Extract file path from Alibaba Cloud URL
 * Handles both full URLs and direct paths
 */
const getFilePathFromUrl = (urlOrPath: string): string => {
  try {
    // If it's a full URL, extract the path
    if (urlOrPath.startsWith("http://") || urlOrPath.startsWith("https://")) {
      const url = new URL(urlOrPath);
      return url.pathname.replace(/^\//, ""); // Remove leading slash
    }
    // If it's already a path, return as is
    return urlOrPath;
  } catch {
    // If URL parsing fails, treat as direct path
    return urlOrPath;
  }
};

export const uploadBufferToAlibaba = async (
  buffer: Buffer,
  destinationPath: string,
  mimeType: string
): Promise<string> => {
  try {
    const result = await client.put(destinationPath, buffer, {
      headers: {
        "Content-Type": mimeType,
      },
    });

    if (!result.url) {
      throw new ApiError(500, "Failed to get Alibaba Cloud upload URL");
    }

    return result.url;
  } catch (error: any) {
    throw new ApiError(
      500,
      `Alibaba Cloud upload failed: ${error.message || "Unknown error"}`
    );
  }
};

export const deleteFromAlibaba = async (urlOrPath: string): Promise<void> => {
  try {
    // Extract path from URL or use directly if already a path
    const filePath = getFilePathFromUrl(urlOrPath);
    await client.delete(filePath);
  } catch (error: any) {
    throw new ApiError(
      500,
      `Alibaba Cloud deletion failed: ${error.message || "Unknown error"}`
    );
  }
};
