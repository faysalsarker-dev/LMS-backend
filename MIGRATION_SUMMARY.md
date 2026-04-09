/**
 * FILE UPLOAD MIGRATION COMPLETE ✅
 * 
 * All routes have been updated to use the new dynamicFileUploadMiddleware
 * which automatically routes uploads to Bunny (international) or 
 * Alibaba Cloud (domestic) based on the isInternational flag.
 */

// ============================================
// UPDATES COMPLETED
// ============================================

/**
 * ✅ CREATED NEW FILES:
 * - src/app/config/alibabaCloud.config.ts
 * - src/app/config/fileUpload.config.ts
 * - src/app/middleware/fileUpload.middleware.ts
 * 
 * ✅ UPDATED FILES:
 * - src/app/config/config.ts - Added Alibaba Cloud environment variables
 * - src/app/modules/auth/auth.interface.ts - Added isInternational field
 * - src/app/modules/auth/User.model.ts - Added isInternational schema field
 * 
 * ✅ MIGRATED ROUTES (8 modules):
 * - src/app/modules/course/course.routes.ts
 * - src/app/modules/category/category.routes.ts
 * - src/app/modules/mockTest/mockTest.routes.ts
 * - src/app/modules/mockTestSubmission/mockTestSubmission.route.ts
 * - src/app/modules/practice/practice.routes.ts
 * - src/app/modules/lesson/lesson.route.ts
 * - src/app/modules/auth/auth.route.ts
 * - src/app/modules/agt/agt.route.ts
 */

// ============================================
// MIGRATION DETAILS BY ROUTE
// ============================================

/**
 * ⚠️ COURSE ROUTES (course.routes.ts)
 * ✅ Changed: multerUpload.single('file') → dynamicFileUploadMiddleware('file')
 * - POST / (createCourse)
 * - PUT /:id (updateCourse)
 * Default: BUNNY (international = true)
 */

/**
 * ⚠️ CATEGORY ROUTES (category.routes.ts)
 * ✅ Changed: multerUpload.single('file') → dynamicFileUploadMiddleware('file')
 * - POST / (create)
 * - PUT /:id (update)
 * Default: BUNNY (international = true)
 */

/**
 * ⚠️ MOCK TEST ROUTES (mockTest.routes.ts)
 * ✅ Changed: multerUpload.single('thumbnail') → dynamicFileUploadMiddleware('thumbnail')
 * - POST / (createMockTest)
 * - PUT /:id (updateMockTest)
 * Default: BUNNY (international = true)
 */

/**
 * ⚠️ MOCK TEST SUBMISSION ROUTES (mockTestSubmission.route.ts)
 * ✅ Changed: multerVideoUpload.single('audio') → dynamicFileUploadMiddleware('audio')
 * - POST /submit-speaking (handleSubmitSpeakingMockTest)
 * Default: BUNNY (international = true)
 */

/**
 * ⚠️ PRACTICE ROUTES (practice.routes.ts)
 * ✅ Changed: multerUpload.single('file') → dynamicFileUploadMiddleware('file')
 * ✅ Changed: multerUpload.fields([...]) → dynamicFileUploadMiddleware(['audio', 'image'])
 * - POST / (createPractice)
 * - PATCH /:id (updatePractice)
 * - POST /items (addItemToPractice) - handles multiple files
 * - PATCH /:practiceId/items/:itemId (updatePracticeItem) - handles multiple files
 * Default: BUNNY (international = true)
 */

/**
 * ⚠️ LESSON ROUTES (lesson.route.ts)
 * ✅ Changed: multerVideoUpload.fields([...]) → dynamicFileUploadMiddleware(['video', 'audioFile'])
 * - POST / (createLessonController) - handles multiple files
 * Default: BUNNY (international = true)
 */

/**
 * ⚠️ AUTH ROUTES (auth.route.ts)
 * ✅ Changed: multerUpload.single('file') → dynamicFileUploadMiddleware('file')
 * - PUT /update (updateProfile)
 * Default: BUNNY (international = true)
 */

/**
 * ⚠️ AGT (ASSIGNMENT) ROUTES (agt.route.ts)
 * ✅ Changed: multerVideoUpload.single('file') → dynamicFileUploadMiddleware('file')
 * ✅ Changed: multerUpload.single('file') → dynamicFileUploadMiddleware('file')
 * - POST / (createSubmission)
 * - PATCH /:id (updateSubmission)
 * Default: BUNNY (international = true)
 */

// ============================================
// NEXT STEPS - CRITICAL
// ============================================

/**
 * 1️⃣  ADD ENVIRONMENT VARIABLES
 *    Add these to your .env file:
 * 
 *    ALIBABA_REGION=oss-cn-beijing
 *    ALIBABA_ACCESS_KEY_ID=your_access_key
 *    ALIBABA_ACCESS_KEY_SECRET=your_access_secret
 *    ALIBABA_BUCKET=your_bucket_name
 */

/**
 * 2️⃣  INSTALL ALI-OSS PACKAGE
 *    npm install ali-oss
 *    npm install --save @types/ali-oss
 */

/**
 * 3️⃣  UPDATE USER DATA (MIGRATION)
 *    Add isInternational field to existing users:
 * 
 *    // Default all existing users to international (Bunny)
 *    db.users.updateMany({}, { $set: { isInternational: true } })
 * 
 *    // Or set based on country:
 *    db.users.updateMany(
 *      { "address.country": { $in: ["CN", "HK", "TW"] } },
 *      { $set: { isInternational: false } }
 *    )
 */

/**
 * 4️⃣  VERIFY AUTHENTICATION PAYLOAD
 *    The CheckAuth middleware now includes isInternational in req.user:
 *    - req.user.isInternational will be passed to the upload middleware
 *    - The dynamicFileUploadMiddleware checks this flag automatically
 */

/**
 * 5️⃣  API USAGE OPTIONS
 *    
 *    OPTION A: Use authenticated user's isInternational
 *    - User must be logged in via checkAuth()
 *    - isInternational comes from their user profile
 *    
 *    OPTION B: Override via request body
 *    - POST /upload with { isInternational: false } in body
 *    - Only if middleware hasn't used req.user yet
 *    
 *    OPTION C: Override via query parameter
 *    - POST /upload?isInternational=false in URL
 *    - Only if middleware hasn't used req.user yet
 *    
 *    OPTION D: Default behavior
 *    - If isInternational is not found anywhere, defaults to true (Bunny)
 */

// ============================================
// TESTING THE MIGRATION
// ============================================

/**
 * 1️⃣  Test with INTERNATIONAL USER (Bunny):
 *    
 *    POST /courses
 *    Authorization: Bearer <token_for_user_with_isInternational=true>
 *    Content-Type: multipart/form-data
 *    
 *    file: <binary_data>
 *    
 *    Expected: File uploaded to Bunny → URL returned
 *    Expected response: { url: "https://bunnycdn.com/..." }
 */

/**
 * 2️⃣  Test with DOMESTIC USER (Alibaba Cloud):
 *    
 *    POST /courses
 *    Authorization: Bearer <token_for_user_with_isInternational=false>
 *    Content-Type: multipart/form-data
 *    
 *    file: <binary_data>
 *    
 *    Expected: File uploaded to Alibaba Cloud → URL returned
 *    Expected response: { url: "https://your-bucket.oss-cn-beijing.aliyuncs.com/..." }
 */

/**
 * 3️⃣  Test without authentication (defaults to Bunny):
 *    
 *    POST /category
 *    Content-Type: multipart/form-data
 *    
 *    file: <binary_data>
 *    
 *    Expected: File uploaded to Bunny (default = international)
 *    Expected response: { url: "https://bunnycdn.com/..." }
 */

// ============================================
// HOW THE MIDDLEWARE WORKS
// ============================================

/**
 * Process Flow:
 * 1. Request arrives with file
 * 2. dynamicFileUploadMiddleware is triggered
 * 3. It checks for isInternational flag in this order:
 *    a. req.user.isInternational (from auth middleware)
 *    b. req.body.isInternational (from request body)
 *    c. req.query.isInternational (from query param)
 *    d. Default to true (Bunny) if not found
 * 4. Creates UniversalStorage with the flag
 * 5. Handles file upload stream
 * 6. Routes to appropriate provider:
 *    - true  → uploadBufferToBunny()
 *    - false → uploadBufferToAlibaba()
 * 7. Returns public URL in req.file.path
 * 8. Also includes req.file.destination ('bunny' or 'alibaba')
 */

// ============================================
// FILE FIELD NAME ROUTING
// ============================================

/**
 * The middleware auto-organizes files by field name:
 * 
 * fieldname: 'video'    → /videos folder
 * fieldname: 'audio'    → /audio folder
 * fieldname: 'audioFile'→ /audio folder
 * fieldname: 'image'    → /images folder
 * fieldname: 'thumbnail'→ /images folder
 * fieldname: other      → /uploads folder
 * 
 * Files are also sanitized and made unique:
 * Original: "My Video (1).mp4"
 * Stored as: "videos/1712701234-a1b2c3d4-my-video-1.mp4"
 */

// ============================================
// ROLLBACK IF NEEDED
// ============================================

/**
 * If you need to rollback to old multer setup:
 * 1. Revert route imports back to multerUpload/multerVideoUpload
 * 2. Change middleware back to .single() or .fields()
 * 3. Delete the new config files
 * 
 * The old multer.config.ts still exists for reference
 */

// ============================================
// TROUBLESHOOTING
// ============================================

/**
 * ❌ "Failed to upload file to Alibaba Cloud"
 *    → Check ALIBABA_REGION, ALIBABA_ACCESS_KEY_ID, ALIBABA_ACCESS_KEY_SECRET, ALIBABA_BUCKET
 *    → Verify ali-oss is installed: npm list ali-oss
 * 
 * ❌ "File size exceeds limit"
 *    → image: 10MB, video: 500MB, audio: 50MB, others: 20MB
 *    → Check FILE_SIZE_LIMITS in fileUpload.middleware.ts
 * 
 * ❌ "Only video files are allowed"
 *    → Check file mimetype matches allowed types
 *    → ALLOWED_MIME_TYPES in fileUpload.middleware.ts
 * 
 * ❌ isInternational is undefined
 *    → Check user is authenticated (checkAuth middleware)
 *    → Or pass isInternational in request body/query
 *    → Or check User model has isInternational field
 */

// ============================================
// PERFORMANCE NOTES
// ============================================

/**
 * ✅ The middleware dynamically creates multer instance on each request
 *    - Allows isInternational to be determined per-request
 *    - Minimal performance impact (multer creation is fast)
 * 
 * ✅ File streams are properly handled
 *    - Chunks are buffered efficiently
 *    - Memory is freed after upload completes
 * 
 * ✅ Both providers support concurrent uploads
 *    - No rate limiting in multer config
 *    - Rate limiting is handled by rateLimit() middleware
 */

// ============================================
// EXAMPLE INTEGRATION
// ============================================

import { dynamicFileUploadMiddleware } from "../../middleware/fileUpload.middleware";
import { checkAuth } from "../../middleware/CheckAuth";

// Example: Course upload with authentication
router.post(
  "/courses",
  checkAuth(),                          // Sets req.user with isInternational
  dynamicFileUploadMiddleware("file"),  // Routes based on req.user.isInternational
  async (req, res) => {
    // req.file now contains:
    // {
    //   path: "https://bunny.../courses/123-abc.jpg",  (public URL)
    //   destination: "bunny",                           ('bunny' or 'alibaba')
    //   filename: "courses/123-abc-course-thumb.jpg",  (internal path)
    //   size: 523456,
    //   mimetype: "image/jpeg"
    // }
    
    const course = {
      title: req.body.title,
      thumbnail: req.file.path,
      provider: req.file.destination,
    };
    
    // Save to database
    await Course.create(course);
    res.json({ success: true, course });
  }
);
