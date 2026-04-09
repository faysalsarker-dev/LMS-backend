import axios from "axios";
import config from "./config";
import { ApiError } from "../errors/ApiError";

const storageZoneName = config.bunny.storage_zone_name;
const storagePassword = config.bunny.storage_zone_password;
const storageRegionHost = config.bunny.storage_region_host || "storage.bunnycdn.com";
const cdnHostname = config.bunny.cdn_hostname;

const getStorageEndpoint = (path: string) =>
  `https://${storageRegionHost}/${storageZoneName}/${path}`;

const getPublicUrl = (path: string) => {
  if (cdnHostname) {
    return `https://${cdnHostname}/${path}`;
  }
  return getStorageEndpoint(path);
};

const getRelativePathFromUrl = (url: string): string | null => {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === storageRegionHost && parsed.pathname.startsWith(`/${storageZoneName}/`)) {
      return parsed.pathname.replace(`/${storageZoneName}/`, "");
    }
    if (cdnHostname && parsed.hostname === cdnHostname) {
      return parsed.pathname.replace(/^\//, "");
    }
    if (parsed.hostname.endsWith("bunnycdn.com") && parsed.pathname.includes(`/${storageZoneName}/`)) {
      return parsed.pathname.split(`/${storageZoneName}/`)[1];
    }
    return null;
  } catch {
    return null;
  }
};

export const uploadBufferToBunny = async (
  buffer: Buffer,
  destinationPath: string,
  mimeType: string,
): Promise<string> => {
  try {
    const url = getStorageEndpoint(destinationPath);

    await axios.put(url, buffer, {
      headers: {
        AccessKey: storagePassword,
        "Content-Type": mimeType,
        "Content-Length": buffer.length,
      },
      maxBodyLength: Infinity,
    });

    return getPublicUrl(destinationPath);
  } catch (error: any) {
    throw new ApiError(500, `Bunny.net upload failed: ${error.message}`);
  }
};

export const deleteFileFromBunny = async (fileUrl: string): Promise<void> => {
  const relativePath = getRelativePathFromUrl(fileUrl);
  if (!relativePath) {
    throw new ApiError(400, `Unable to parse Bunny.net file URL: ${fileUrl}`);
  }

  const url = getStorageEndpoint(relativePath);
  await axios.delete(url, {
    headers: {
      AccessKey: storagePassword,
    },
  });
};
