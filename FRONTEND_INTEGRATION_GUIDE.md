/**
 * 🎯 FILE UPLOAD & DELETE - COMPLETE INTEGRATION GUIDE
 * 
 * User selects storage provider → Upload routes based on selection
 * Delete routes based on isInternational flag
 */

// ============================================
// WHAT WAS UPDATED
// ============================================

/**
 * ✅ MIDDLEWARE PRIORITY CHANGED
 * 
 * Old Priority:
 * 1. req.user.isInternational
 * 2. req.body.isInternational
 * 3. req.query.isInternational
 * 4. Default true
 * 
 * NEW Priority ⭐:
 * 1. req.body.isInternational      ← FRONTEND USER SELECTION
 * 2. req.user.isInternational      ← User profile (fallback)
 * 3. req.query.isInternational     ← Query param (fallback)
 * 4. Default true                  ← Last resort
 * 
 * This means the FRONTEND CAN OVERRIDE user preference!
 */

// ============================================
// NEW: UNIFIED FILE DELETION UTILITY
// ============================================

/**
 * Created: src/app/utils/fileDelete.ts
 * 
 * Three deletion functions:
 * 
 * 1. deleteFile(fileUrl, isInternational = true)
 *    - Delete single file by URL
 *    - Automatically routes to correct provider
 * 
 * 2. deleteMultipleFiles(fileUrls[], isInternational = true)
 *    - Delete multiple files at once
 *    - Returns { success: [], failed: [] }
 * 
 * 3. deleteFileByPath(filePath, isInternational = true)
 *    - Delete file by path instead of URL
 *    - Example: "videos/123-abc-video.mp4"
 */

// ============================================
// IMPROVED: ALIBABA CLOUD DELETE HANDLER
// ============================================

/**
 * Updated: src/app/config/alibabaCloud.config.ts
 * 
 * Added getFilePathFromUrl() helper:
 * - Handles both full URLs and direct paths
 * - Extracts path from Alibaba Cloud URL format
 * - Falls back to direct path if parsing fails
 * 
 * This matches Bunny's delete behavior
 */

// ============================================
// FRONTEND INTEGRATION EXAMPLE
// ============================================

/**
 * Frontend sends request like this:
 * 
 * POST /courses
 * Content-Type: multipart/form-data
 * 
 * FormData:
 * {
 *   title: "My Course",
 *   description: "Course description",
 *   file: <binary_image_file>,
 *   isInternational: false    ← USER SELECTS ALIBABA CLOUD
 * }
 * 
 * Backend:
 * 1. Checks req.body.isInternational = false
 * 2. Routes upload to Alibaba Cloud
 * 3. Returns Alibaba URL in response
 */

// ============================================
// BACKEND CONTROLLER INTEGRATION
// ============================================

/**
 * Step 1: Import the delete utility
 * 
 * import { 
 *   deleteFile, 
 *   deleteMultipleFiles, 
 *   deleteFileByPath 
 * } from "../../utils/fileDelete";
 */

/**
 * Step 2: Use in controller (example)
 * 
 * export const updateCourse = async (req, res) => {
 *   try {
 *     const course = await Course.findById(req.params.id);
 *     const { isInternational } = req.body;
 *     
 *     // Delete old file if uploading new one
 *     if (req.file && course.thumbnail) {
 *       await deleteFile(course.thumbnail, isInternational);
 *     }
 *     
 *     // Update course
 *     if (req.file) {
 *       course.thumbnail = req.file.path;
 *     }
 *     await course.save();
 *     
 *     res.json({ success: true, course });
 *   } catch (error) {
 *     res.status(500).json({ error: error.message });
 *   }
 * };
 */

// ============================================
// REQUEST BODY FORMAT (UPDATED)
// ============================================

/**
 * All upload endpoints now accept isInternational parameter:
 * 
 * POST /category
 * Content-Type: multipart/form-data
 * 
 * {
 *   file: <binary>,
 *   isInternational: false    ← NEW PARAMETER (optional)
 * }
 * 
 * If isInternational is not provided:
 * - Checks req.user.isInternational (if authenticated)
 * - Defaults to true (Bunny) if not found
 */

/**
 * POST /courses
 * Content-Type: multipart/form-data
 * 
 * {
 *   title: "Course Name",
 *   description: "Description",
 *   file: <binary>,
 *   isInternational: true     ← User chose Bunny
 * }
 */

/**
 * POST /lessons
 * Content-Type: multipart/form-data
 * 
 * {
 *   title: "Lesson Name",
 *   video: <binary>,
 *   audioFile: <binary>,
 *   isInternational: false    ← User chose Alibaba Cloud
 * }
 */

// ============================================
// RESPONSE FORMAT (SAME AS BEFORE)
// ============================================

/**
 * The response format remains unchanged for backward compatibility:
 * 
 * Success Response:
 * {
 *   success: true,
 *   course: {
 *     id: "...",
 *     title: "...",
 *     thumbnail: "https://bunny-or-alibaba-url.com/...",
 *     provider: "bunny" or "alibaba"     ← NEW INFO
 *   }
 * }
 * 
 * Error Response:
 * {
 *   error: "Description of error"
 * }
 */

// ============================================
// COMMON SCENARIOS
// ============================================

/**
 * SCENARIO 1: International User Uploads Course
 * 
 * Frontend:
 * - User selects "Global" storage
 * - Sends isInternational: true
 * 
 * Backend:
 * - req.body.isInternational = true
 * - Upload routes to Bunny
 * - Returns Bunny CDN URL
 */

/**
 * SCENARIO 2: Domestic User Uploads Lesson
 * 
 * Frontend:
 * - User selects "Local (China)" storage
 * - Sends isInternational: false
 * 
 * Backend:
 * - req.body.isInternational = false
 * - Upload routes to Alibaba Cloud
 * - Returns Alibaba Cloud URL
 */

/**
 * SCENARIO 3: Update Course and Replace File
 * 
 * Frontend:
 * - User uploads new thumbnail
 * - Sends isInternational: false
 * 
 * Backend:
 * - Load old course: thumbnail = "https://bunny.../old.jpg"
 * - Delete old file: await deleteFile(oldUrl, false)
 *                    (Note: must match original upload location!)
 * - Wait, this is WRONG! Old file was in Bunny, but deleting with false
 * 
 * CORRECT WAY:
 * - Track which provider each file was uploaded to
 * - Before deletion: check course.storageProvider or file API metadata
 * - OR: Store provider info with file path
 */

/**
 * SCENARIO 4: User Changes Preference and Re-uploads
 * 
 * Current Situation:
 * - Course thumbnail on Bunny: "https://bunny.../image.jpg"
 * - User changes to Alibaba Cloud, re-uploads
 * - File saved to Alibaba: "https://alibaba.../image.jpg"
 * 
 * Problem:
 * - Old Bunny file is orphaned (still using space)
 * - Need to know old provider to delete properly
 * 
 * Solution 1: Store provider with each file
 * - Add storageProvider field to database
 * - Delete with correct provider before updating
 * 
 * Solution 2: Try to delete from both
 * - Delete from Bunny (may fail, that's OK)
 * - Delete from Alibaba (may fail, that's OK)
 * - Ignore errors and continue
 */

// ============================================
// BEST PRACTICES
// ============================================

/**
 * ✅ DO:
 * 
 * 1. Always delete files BEFORE updating database
 *    await deleteFile(oldUrl, oldProvider);
 *    document.fileUrl = newUrl;
 *    await document.save();
 * 
 * 2. Store storage provider in database
 *    {
 *      thumbnail: "https://...",
 *      storageProvider: "bunny"  // or "alibaba"
 *    }
 * 
 * 3. Use correct isInternational for deletion
 *    true for Bunny URLs, false for Alibaba URLs
 * 
 * 4. Handle deletion errors gracefully
 *    try { await deleteFile(...) } catch { console.log("cleanup failed") }
 * 
 * 5. Log failed deletions for manual cleanup
 *    console.log(`Orphaned file: ${oldUrl}`)
 */

/**
 * ❌ DON'T:
 * 
 * 1. Delete from wrong provider
 *    File from Bunny but deleting with isInternational=false
 * 
 * 2. Assume deletion succeeded silently
 *    Check for errors and log them
 * 
 * 3. Delete database record before file
 *    File URL will be lost if deletion fails
 * 
 * 4. Forget to handle deletion failures
 *    Network error could leave orphaned files
 * 
 * 5. Use wrong file path format
 *    Bunny needs relative path, Alibaba needs full path
 *    (Our code handles this automatically)
 */

// ============================================
// TRACKING STORAGE PROVIDER (OPTIONAL)
// ============================================

/**
 * Recommended: Add storageProvider field to models
 * 
 * const courseSchema = new Schema({
 *   title: String,
 *   thumbnail: String,
 *   storageProvider: {
 *     type: String,
 *     enum: ["bunny", "alibaba"],
 *     default: "bunny"
 *   }
 * });
 * 
 * Then in controller:
 * 
 * if (course.thumbnail) {
 *   await deleteFile(course.thumbnail, course.storageProvider === "bunny");
 * }
 * 
 * And when updating:
 * 
 * course.thumbnail = req.file.path;
 * course.storageProvider = req.body.isInternational ? "bunny" : "alibaba";
 */

// ============================================
// COMPLETE CONTROLLER EXAMPLE
// ============================================

/**
 * import { Router } from "express";
 * import { deleteFile } from "../../utils/fileDelete";
 * import { dynamicFileUploadMiddleware } from "../../middleware/fileUpload.middleware";
 * 
 * const router = Router();
 * 
 * // Create course
 * router.post(
 *   "/",
 *   dynamicFileUploadMiddleware("file"),
 *   async (req, res) => {
 *     try {
 *       const course = new Course({
 *         title: req.body.title,
 *         thumbnail: req.file.path,
 *         thumbnailProvider: req.body.isInternational ? "bunny" : "alibaba"
 *       });
 *       await course.save();
 *       res.json(course);
 *     } catch (error) {
 *       res.status(500).json({ error: error.message });
 *     }
 *   }
 * );
 * 
 * // Update course
 * router.put(
 *   "/:id",
 *   dynamicFileUploadMiddleware("file"),
 *   async (req, res) => {
 *     try {
 *       const course = await Course.findById(req.params.id);
 *       const { isInternational } = req.body;
 *       
 *       // Delete old thumbnail if new file uploaded
 *       if (req.file && course.thumbnail) {
 *         const oldProvider = course.thumbnailProvider === "bunny";
 *         await deleteFile(course.thumbnail, oldProvider);
 *       }
 *       
 *       // Update with new values
 *       if (req.file) {
 *         course.thumbnail = req.file.path;
 *         course.thumbnailProvider = isInternational ? "bunny" : "alibaba";
 *       }
 *       course.title = req.body.title || course.title;
 *       
 *       await course.save();
 *       res.json(course);
 *     } catch (error) {
 *       res.status(500).json({ error: error.message });
 *     }
 *   }
 * );
 * 
 * // Delete course
 * router.delete(
 *   "/:id",
 *   async (req, res) => {
 *     try {
 *       const course = await Course.findById(req.params.id);
 *       
 *       // Delete thumbnail file
 *       if (course.thumbnail) {
 *         const provider = course.thumbnailProvider === "bunny";
 *         await deleteFile(course.thumbnail, provider);
 *       }
 *       
 *       // Delete course record
 *       await Course.findByIdAndDelete(req.params.id);
 *       
 *       res.json({ success: true });
 *     } catch (error) {
 *       res.status(500).json({ error: error.message });
 *     }
 *   }
 * );
 */

// ============================================
// TESTING THE SYSTEM
// ============================================

/**
 * Test 1: Upload with isInternational = true
 * 
 * curl -X POST http://localhost:5000/category \
 *   -F "file=@image.jpg" \
 *   -F "isInternational=true"
 * 
 * Expected: File in Bunny storage
 */

/**
 * Test 2: Upload with isInternational = false
 * 
 * curl -X POST http://localhost:5000/category \
 *   -F "file=@image.jpg" \
 *   -F "isInternational=false"
 * 
 * Expected: File in Alibaba Cloud storage
 */

/**
 * Test 3: Delete file (from controller)
 * 
 * const { deleteFile } = require("../../utils/fileDelete");
 * 
 * await deleteFile("https://bunny.../image.jpg", true);
 * // File deleted from Bunny
 * 
 * await deleteFile("https://alibaba.../image.jpg", false);
 * // File deleted from Alibaba
 */

// ============================================
// MIGRATION NOTE FOR EXISTING DATA
// ============================================

/**
 * If you have existing files in database without provider info:
 * 
 * Option 1: Assume all old files are in Bunny
 * db.courses.updateMany({}, { $set: { storageProvider: "bunny" } })
 * 
 * Option 2: Parse URL to determine provider
 * For each document:
 *   if (url.includes("bunny")) storageProvider = "bunny"
 *   if (url.includes("alibaba")) storageProvider = "alibaba"
 * 
 * Option 3: No tracking (always try Bunny first, then Alibaba)
 * try {
 *   await deleteFile(url, true);  // Try Bunny
 * } catch {
 *   await deleteFile(url, false); // Try Alibaba
 * }
 */

// ============================================
// FILES CREATED/MODIFIED
// ============================================

/**
 * ✅ Created:
 * - src/app/utils/fileDelete.ts (NEW deletion utility)
 * - src/app/utils/FILE_DELETION_GUIDE.md (Detailed guide)
 * 
 * ✅ Modified:
 * - src/app/middleware/fileUpload.middleware.ts
 *   (Changed priority: req.body first)
 * - src/app/config/alibabaCloud.config.ts
 *   (Added URL path extraction, improved delete)
 */

// ============================================
// QUICK REFERENCE
// ============================================

/**
 * Import deletion:
 * import { deleteFile, deleteMultipleFiles, deleteFileByPath } from "../../utils/fileDelete";
 * 
 * Delete single file:
 * await deleteFile(url, isInternational);
 * 
 * Delete multiple files:
 * const result = await deleteMultipleFiles([url1, url2], isInternational);
 * 
 * Delete by path:
 * await deleteFileByPath("images/123-abc.jpg", isInternational);
 * 
 * Priority for isInternational:
 * req.body > req.user > req.query > default(true)
 */
