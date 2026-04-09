/**
 * FILE UPLOAD MIDDLEWARE USAGE GUIDE
 * 
 * This middleware automatically routes file uploads to either Bunny (International) 
 * or Alibaba Cloud (Domestic) based on the isInternational flag.
 */

/**
 * SETUP INSTRUCTIONS:
 * 
 * 1. Add to .env file:
 *    ALIBABA_REGION=oss-cn-beijing
 *    ALIBABA_ACCESS_KEY_ID=your_access_key
 *    ALIBABA_ACCESS_KEY_SECRET=your_access_secret
 *    ALIBABA_BUCKET=your_bucket_name
 * 
 * 2. Install ali-oss package:
 *    npm install ali-oss
 */

// ============================================
// OPTION 1: Static Upload (Bunny - Default)
// ============================================
import { uploadToInternational } from "../middleware/fileUpload.middleware";

router.post('/upload/image', uploadToInternational.single('image'), (req, res) => {
  console.log('Uploaded to Bunny:', req.file?.path);
  res.json({ url: req.file?.path });
});

// ============================================
// OPTION 2: Static Upload (Alibaba Cloud)
// ============================================
import { uploadToDomestic } from "../middleware/fileUpload.middleware";

router.post('/upload/local', uploadToDomestic.single('file'), (req, res) => {
  console.log('Uploaded to Alibaba Cloud:', req.file?.path);
  res.json({ url: req.file?.path });
});

// ============================================
// OPTION 3: Dynamic Upload (RECOMMENDED)
// Choose provider based on request.user.isInternational
// ============================================
import { dynamicFileUploadMiddleware } from "../middleware/fileUpload.middleware";

// Single file
router.post('/upload/video', 
  dynamicFileUploadMiddleware('video'), 
  (req, res) => {
    const provider = (req.file as any)?.destination || 'bunny';
    console.log(`Uploaded to ${provider}:`, req.file?.path);
    res.json({ url: req.file?.path, provider });
  }
);

// Multiple files
router.post('/upload/multiple', 
  dynamicFileUploadMiddleware(['image', 'video']), 
  (req, res) => {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    res.json({ 
      image: files.image?.[0]?.path,
      video: files.video?.[0]?.path 
    });
  }
);

// ============================================
// OPTION 4: Custom Configuration
// ============================================
import { fileUploadMiddleware } from "../middleware/fileUpload.middleware";

// Explicitly set to use Bunny (international = true)
const uploadToBunnyExplicit = fileUploadMiddleware(true);

// Explicitly set to use Alibaba Cloud (international = false)
const uploadToAlibabaExplicit = fileUploadMiddleware(false);

// ============================================
// HOW THE MIDDLEWARE DETECTS isInternational
// ============================================
/**
 * The dynamicFileUploadMiddleware checks in this order:
 * 1. req.user.isInternational (set by auth middleware)
 * 2. req.body.isInternational (sent in request body)
 * 3. req.query.isInternational (sent as query parameter)
 * 4. Default to true (Bunny) if none provided
 */

// Example 1: From authenticated user
router.post(
  '/upload',
  checkAuth(), // Sets req.user with isInternational flag
  dynamicFileUploadMiddleware('file'),
  controllerHandler
);

// Example 2: From request body
POST /upload
Content-Type: multipart/form-data
{
  file: <binary>,
  isInternational: false  // Will use Alibaba Cloud
}

// Example 3: From query parameter
router.post(
  '/upload/:type',
  dynamicFileUploadMiddleware('file'),
  controllerHandler
);
// POST /upload/image?isInternational=false

// ============================================
// SUPPORTED FILE TYPES & SIZES
// ============================================
/**
 * - Image (10MB): .jpg, .jpeg, .png, .gif, .webp, .svg
 * - Video (500MB): .mp4, .mpeg, .mov, .avi
 * - Audio (50MB): .mp3, .wav, .ogg, .webm
 * - Other files (20MB): any other type
 * 
 * Field names that auto-detect type:
 * - 'video' → routes to videos folder
 * - 'audio' or 'audioFile' → routes to audio folder
 * - 'image', 'thumbnail', 'profilePicture' → routes to images folder
 * - anything else → routes to uploads folder
 */

// ============================================
// RESPONSE STRUCTURE
// ============================================
/**
 * After successful upload, req.file contains:
 * {
 *   fieldname: string        // Field name from form
 *   originalname: string     // Original file name
 *   mimetype: string         // MIME type
 *   size: number            // File size in bytes
 *   path: string            // CDN URL (public URL)
 *   destination: string     // 'bunny' or 'alibaba'
 *   filename: string        // Sanitized filename with path
 *   buffer: Buffer          // File buffer
 * }
 */

// Example controller usage:
const handleFileUpload = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { path, destination, filename } = req.file;
    
    res.json({
      success: true,
      url: path,
      provider: destination, // 'bunny' or 'alibaba'
      filename: filename
    });
  } catch (error) {
    res.status(500).json({ error: 'Upload failed' });
  }
};

// ============================================
// INTEGRATION WITH EXISTING CODE
// ============================================

// In your routes/index.ts or route files:
import { dynamicFileUploadMiddleware } from "../middleware/fileUpload.middleware";
import { checkAuth } from "../middleware/CheckAuth";

// Example: Course thumbnail upload
router.post(
  '/courses/:id/upload-thumbnail',
  checkAuth(), // User must be authenticated and have isInternational flag
  dynamicFileUploadMiddleware('thumbnail'),
  courseController.uploadThumbnail
);

// Example: Lesson video upload
router.post(
  '/lessons/:id/upload-video',
  checkAuth(),
  dynamicFileUploadMiddleware('video'),
  lessonController.uploadVideo
);
