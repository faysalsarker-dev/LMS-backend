/**
 * 🚀 FILE UPLOAD MIDDLEWARE SETUP CHECKLIST
 * 
 * All code changes are complete ✅
 * Follow these steps to fully activate the system
 */

// ============================================
// STEP 1: INSTALL DEPENDENCIES
// ============================================

/**
 * Run these commands in your project directory:
 * 
 * npm install ali-oss
 * npm install --save @types/ali-oss
 */

// ============================================
// STEP 2: UPDATE .env FILE
// ============================================

/**
 * Add these environment variables to your .env file:
 * 
 * # Alibaba Cloud OSS Configuration
 * ALIBABA_REGION=oss-cn-beijing
 * ALIBABA_ACCESS_KEY_ID=your_actual_access_key
 * ALIBABA_ACCESS_KEY_SECRET=your_actual_access_secret
 * ALIBABA_BUCKET=your_bucket_name
 * 
 * Keep your existing BUNNY environment variables:
 * BUNNY_STORAGE_ZONE_NAME=...
 * BUNNY_STORAGE_ZONE_PASSWORD=...
 * BUNNY_STORAGE_REGION_HOST=...
 * BUNNY_CDN_HOSTNAME=...
 */

// ============================================
// STEP 3: DATABASE MIGRATION
// ============================================

/**
 * Option A: Add isInternational field to all existing users
 * (Set default to true = use Bunny for everyone initially)
 * 
 * db.users.updateMany(
 *   {},
 *   { $set: { isInternational: true } }
 * )
 * 
 * ---
 * 
 * Option B: Set based on user's country
 * (This assumes users have address.country set)
 * 
 * db.users.updateMany(
 *   { "address.country": "CN" },
 *   { $set: { isInternational: false } }
 * )
 * 
 * db.users.updateMany(
 *   { "address.country": { $nin: ["CN", "HK", "TW"] } },
 *   { $set: { isInternational: true } }
 * )
 * 
 * ---
 * 
 * Option C: Create a migration script in your codebase
 */

// ============================================
// STEP 4: VERIFY FILE STRUCTURE
// ============================================

/**
 * ✅ New files created:
 * 
 * src/app/config/alibabaCloud.config.ts       (Alibaba Cloud setup)
 * src/app/config/fileUpload.config.ts         (Universal storage class)
 * src/app/middleware/fileUpload.middleware.ts (Dynamic middleware)
 * src/app/middleware/FILE_UPLOAD_USAGE.md     (Usage guide)
 * MIGRATION_SUMMARY.md                        (Detailed breakdown)
 * SETUP_CHECKLIST.md                          (This file)
 * 
 * ✅ Files modified:
 * 
 * src/app/config/config.ts                    (Added Alibaba env vars)
 * src/app/modules/auth/auth.interface.ts      (Added isInternational)
 * src/app/modules/auth/User.model.ts          (Added isInternational field)
 * 
 * ✅ Routes updated (8 modules):
 * 
 * src/app/modules/course/course.routes.ts
 * src/app/modules/category/category.routes.ts
 * src/app/modules/mockTest/mockTest.routes.ts
 * src/app/modules/mockTestSubmission/mockTestSubmission.route.ts
 * src/app/modules/practice/practice.routes.ts
 * src/app/modules/lesson/lesson.route.ts
 * src/app/modules/auth/auth.route.ts
 * src/app/modules/agt/agt.route.ts
 */

// ============================================
// STEP 5: REBUILD AND TEST
// ============================================

/**
 * 1. Rebuild TypeScript:
 *    npm run build
 *    (or your build command)
 * 
 * 2. Start the server:
 *    npm run start
 *    (or your start command)
 * 
 * 3. Check for compilation errors
 *    (Should see 0 errors if setup is correct)
 */

// ============================================
// STEP 6: TEST THE UPLOAD MIDDLEWARE
// ============================================

/**
 * Test Case 1: Upload as international user (Bunny)
 * 
 * POST http://localhost:5000/category
 * 
 * Headers:
 * Authorization: Bearer <international_user_token>
 * 
 * Body (multipart/form-data):
 * file: [image file]
 * 
 * Expected Response:
 * {
 *   "url": "https://your-bunnycdn.com/images/...",
 *   "provider": "bunny"
 * }
 */

/**
 * Test Case 2: Upload as domestic user (Alibaba)
 * 
 * POST http://localhost:5000/category
 * 
 * Headers:
 * Authorization: Bearer <domestic_user_token>
 * 
 * Body (multipart/form-data):
 * file: [image file]
 * 
 * Expected Response:
 * {
 *   "url": "https://your-bucket.oss-cn-beijing.aliyuncs.com/...",
 *   "provider": "alibaba"
 * }
 */

/**
 * Test Case 3: Upload with unauthenticated user (defaults to Bunny)
 * 
 * POST http://localhost:5000/category
 * 
 * Body (multipart/form-data):
 * file: [image file]
 * 
 * Expected Response:
 * {
 *   "url": "https://your-bunnycdn.com/images/...",
 *   "provider": "bunny"
 * }
 */

/**
 * Test Case 4: Upload with override flag
 * 
 * POST http://localhost:5000/category?isInternational=false
 * 
 * Body (multipart/form-data):
 * file: [image file]
 * 
 * Expected Response:
 * {
 *   "url": "https://your-bucket.oss-cn-beijing.aliyuncs.com/...",
 *   "provider": "alibaba"
 * }
 */

// ============================================
// STEP 7: MONITOR & VERIFY
// ============================================

/**
 * After deployment, verify:
 * 
 * ✅ Files are uploading successfully
 * ✅ Bunny users get Bunny URLs
 * ✅ Alibaba users get Alibaba URLs
 * ✅ File sizes are within limits
 * ✅ MIME type validation is working
 * ✅ Error messages are clear
 * ✅ CDN URLs are publicly accessible
 */

// ============================================
// STEP 8: UPDATE DOCUMENTATION
// ============================================

/**
 * Update your API documentation to reflect:
 * 
 * 1. New file upload behavior
 * 2. isInternational flag affects provider selection
 * 3. Response now includes provider info
 * 4. File size limits per type
 * 5. Allowed MIME types
 * 6. Example responses for each provider
 */

// ============================================
// TROUBLESHOOTING QUICK REFERENCE
// ============================================

/**
 * Problem: ali-oss module not found
 * Solution: npm install ali-oss
 * 
 * Problem: ALIBABA_REGION is undefined in config
 * Solution: Check .env file has ALIBABA_REGION=oss-cn-beijing
 * 
 * Problem: Files only uploading to Bunny, never to Alibaba
 * Solution: Check users have isInternational field set correctly
 *          Run database migration to set the field
 * 
 * Problem: TypeError: Cannot read property 'destination' of undefined
 * Solution: Ensure middleware is placed BEFORE controller
 *          in route definition
 * 
 * Problem: isInternational always undefined
 * Solution: Ensure checkAuth() middleware is before file upload middleware
 *          Or pass isInternational in request body/query
 * 
 * Problem: 413 Payload Too Large
 * Solution: Check file size limits in fileUpload.middleware.ts
 *          Image: 10MB, Video: 500MB, Audio: 50MB, Other: 20MB
 * 
 * Problem: "Only video files are allowed for video field"
 * Solution: Check file MIME type
 *          Allowed: video/mp4, video/mpeg, video/quicktime, video/x-msvideo
 */

// ============================================
// KEY CHANGES SUMMARY
// ============================================

/**
 * BEFORE (Old System):
 * - All files uploaded to Bunny only
 * - Used multerUpload or multerVideoUpload directly
 * - No support for Alibaba Cloud
 * - No user location awareness
 * 
 * AFTER (New System):
 * - Files route to Bunny OR Alibaba Cloud based on user location
 * - Uses dynamicFileUploadMiddleware for all uploads
 * - Full support for Alibaba Cloud
 * - User's isInternational flag determines provider
 * - Defaults to Bunny if location unknown
 * - Same file organization (videos/, audio/, images/, uploads/)
 * - Same MIME type and size validation
 * - Backwards compatible response format
 */

// ============================================
// NEXT: ADVANCED CONFIGURATION
// ============================================

/**
 * To customize behavior further:
 * 
 * 1. Adjust FILE_SIZE_LIMITS in fileUpload.middleware.ts
 * 2. Modify ALLOWED_MIME_TYPES for different file types
 * 3. Update file folder organization logic in fileUpload.config.ts
 * 4. Add custom error messages for specific scenarios
 * 5. Implement provider fallback (e.g., if Alibaba fails, try Bunny)
 */

// ============================================
// FINAL CHECKLIST
// ============================================

/**
 * Before marking as complete:
 * 
 * [ ] npm install ali-oss completed
 * [ ] .env file updated with ALIBABA_* variables
 * [ ] Database migration run to add isInternational field
 * [ ] npm run build succeeds with 0 errors
 * [ ] Server starts without errors
 * [ ] Test case 1 (Bunny upload) passes
 * [ ] Test case 2 (Alibaba upload) passes
 * [ ] Test case 3 (default to Bunny) passes
 * [ ] Test case 4 (override flag) passes
 * [ ] Files are accessible via CDN URLs
 * [ ] Error messages are working correctly
 * [ ] Documentation updated
 * [ ] Team briefed on new upload system
 * 
 * ✅ SETUP COMPLETE!
 */
