import { deleteFileFromBunny } from "../config/bunny.config";
import { deleteFromAlibaba } from "../config/alibabaCloud.config";
import { ApiError } from "../errors/ApiError";

/**
 * Unified file deletion function
 * Routes to appropriate provider based on isInternational flag
 * 
 * @param fileUrl - File URL or path to delete
 * @param isInternational - Boolean flag (true = Bunny, false = Alibaba Cloud). Default: true
 * @throws ApiError if deletion fails
 */
export const deleteFile = async (
  fileUrl: string,
  isInternational: boolean = true
): Promise<void> => {
  if (!fileUrl) {
    throw new ApiError(400, "File URL is required for deletion");
  }

  try {
    if (isInternational) {
      // Delete from Bunny
      await deleteFileFromBunny(fileUrl);
    } else {
      // Delete from Alibaba Cloud
      await deleteFromAlibaba(fileUrl);
    }
  } catch (error: any) {
    throw new ApiError(
      500,
      `Failed to delete file: ${error.message || "Unknown error"}`
    );
  }
};

/**
 * Delete multiple files from the same provider
 * 
 * @param fileUrls - Array of file URLs to delete
 * @param isInternational - Boolean flag (true = Bunny, false = Alibaba Cloud). Default: true
 * @throws ApiError if any deletion fails
 */
export const deleteMultipleFiles = async (
  fileUrls: string[],
  isInternational: boolean = true
): Promise<{ success: string[]; failed: string[] }> => {
  const successCount: string[] = [];
  const failedUrls: string[] = [];

  for (const fileUrl of fileUrls) {
    try {
      await deleteFile(fileUrl, isInternational);
      successCount.push(fileUrl);
    } catch (error: any) {
      failedUrls.push(fileUrl);
      console.error(`Failed to delete ${fileUrl}:`, error.message);
    }
  }

  return {
    success: successCount,
    failed: failedUrls,
  };
};

/**
 * Delete file by its path/filename instead of URL
 * Useful when you only have the storage path, not the full URL
 * 
 * @param filePath - File path (e.g., "videos/123-abc-video.mp4")
 * @param isInternational - Boolean flag (true = Bunny, false = Alibaba Cloud). Default: true
 */
export const deleteFileByPath = async (
  filePath: string,
  isInternational: boolean = true
): Promise<void> => {
  if (!filePath) {
    throw new ApiError(400, "File path is required for deletion");
  }

  try {
    if (isInternational) {
      // For Bunny, pass the path directly
      await deleteFileFromBunny(filePath);
    } else {
      // For Alibaba, pass the path directly
      await deleteFromAlibaba(filePath);
    }
  } catch (error: any) {
    throw new ApiError(
      500,
      `Failed to delete file at path ${filePath}: ${error.message || "Unknown error"}`
    );
  }
};
