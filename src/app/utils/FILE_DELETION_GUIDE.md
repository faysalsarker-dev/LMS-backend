/**
 * FILE DELETION - USAGE GUIDE
 * 
 * New unified file deletion system with provider routing
 */

// ============================================
// IMPORT THE DELETE UTILITY
// ============================================

import { deleteFile, deleteMultipleFiles, deleteFileByPath } from "../../utils/fileDelete";

// ============================================
// OPTION 1: DELETE SINGLE FILE BY URL
// ============================================

/**
 * Use when you have the full file URL (stored in database)
 * Automatically routes to correct provider based on isInternational flag
 */
const deleteSingleFile = async (fileUrl: string, isInternational: boolean = true) => {
  try {
    await deleteFile(fileUrl, isInternational);
    console.log("File deleted successfully");
  } catch (error) {
    console.error("Deletion failed:", error.message);
  }
};

// Example usage:
// const course = await Course.findById(courseId);
// if (course.thumbnail) {
//   await deleteFile(course.thumbnail, course.isInternational);
//   course.thumbnail = null;
//   await course.save();
// }

// ============================================
// OPTION 2: DELETE MULTIPLE FILES AT ONCE
// ============================================

/**
 * Delete array of files from the same provider
 * Returns which deletions succeeded and which failed
 */
const deleteMultiple = async (fileUrls: string[], isInternational: boolean = true) => {
  try {
    const result = await deleteMultipleFiles(fileUrls, isInternational);
    console.log("Deleted:", result.success);
    console.log("Failed:", result.failed);
  } catch (error) {
    console.error("Batch deletion failed:", error.message);
  }
};

// Example usage:
// const lesson = await Lesson.findById(lessonId);
// const filesToDelete = [lesson.video, lesson.audioFile].filter(Boolean);
// await deleteMultipleFiles(filesToDelete, lesson.isInternational);

// ============================================
// OPTION 3: DELETE BY FILE PATH
// ============================================

/**
 * Use when you only have the storage path, not the full URL
 * Example: "videos/123-abc-video.mp4"
 */
const deleteByPath = async (filePath: string, isInternational: boolean = true) => {
  try {
    await deleteFileByPath(filePath, isInternational);
    console.log("File deleted successfully");
  } catch (error) {
    console.error("Deletion failed:", error.message);
  }
};

// ============================================
// REAL-WORLD CONTROLLER EXAMPLES
// ============================================

/**
 * Example 1: Update course and delete old thumbnail
 */
export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, isInternational } = req.body;
    
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Delete old thumbnail if new one is uploaded
    if (req.file && course.thumbnail) {
      await deleteFile(course.thumbnail, isInternational);
    }

    // Update course with new data
    course.title = title || course.title;
    course.description = description || course.description;
    if (req.file) {
      course.thumbnail = req.file.path;
      course.isInternational = isInternational;
    }

    await course.save();
    res.json({ success: true, course });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Example 2: Delete course and all its files
 */
export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Delete thumbnail
    if (course.thumbnail) {
      await deleteFile(course.thumbnail, course.isInternational);
    }

    // Delete course related files
    await Course.findByIdAndDelete(id);
    
    res.json({ success: true, message: "Course and files deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Example 3: Delete lesson with multiple files
 */
export const deleteLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const lesson = await Lesson.findById(id);
    
    if (!lesson) {
      return res.status(404).json({ error: "Lesson not found" });
    }

    // Delete video and audio files
    const filesToDelete = [lesson.video, lesson.audioFile].filter(Boolean);
    
    if (filesToDelete.length > 0) {
      await deleteMultipleFiles(filesToDelete, lesson.isInternational);
    }

    await Lesson.findByIdAndDelete(id);
    
    res.json({ success: true, message: "Lesson and all files deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Example 4: Update user profile picture
 */
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { isInternational } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Delete old profile picture if uploading new one
    if (req.file && user.profile) {
      await deleteFile(user.profile, isInternational);
    }

    // Update user with new profile picture
    if (req.file) {
      user.profile = req.file.path;
    }

    await user.save();
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Example 5: Practice item deletion
 */
export const deletePracticeItem = async (req, res) => {
  try {
    const { practiceId, itemId } = req.params;
    const { isInternational } = req.body;
    
    const practice = await Practice.findById(practiceId);
    if (!practice) {
      return res.status(404).json({ error: "Practice not found" });
    }

    const item = practice.items.id(itemId);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    // Delete audio and image files associated with item
    const filesToDelete = [item.audio, item.image].filter(Boolean);
    
    if (filesToDelete.length > 0) {
      await deleteMultipleFiles(filesToDelete, isInternational);
    }

    // Remove item from practice
    practice.items.id(itemId).deleteOne();
    await practice.save();

    res.json({ success: true, message: "Item and files deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ============================================
// API USAGE EXAMPLES
// ============================================

/**
 * To use these controllers, make requests like:
 * 
 * UPDATE COURSE:
 * PUT /courses/123
 * Content-Type: multipart/form-data
 * 
 * Body:
 * {
 *   title: "New Title",
 *   isInternational: false,     // Route to Alibaba
 *   file: <binary>
 * }
 * 
 * DELETE COURSE:
 * DELETE /courses/123
 * 
 * Expected: Thumbnail deleted, course record deleted
 */

/**
 * UPDATE PROFILE:
 * PUT /auth/update
 * Content-Type: multipart/form-data
 * Authorization: Bearer <token>
 * 
 * Body:
 * {
 *   isInternational: true,      // Route to Bunny
 *   file: <binary>
 * }
 * 
 * Expected: Old profile picture deleted, new one uploaded
 */

/**
 * DELETE LESSON:
 * DELETE /lessons/456
 * Content-Type: application/json
 * 
 * Expected: Video and audio deleted, lesson record deleted
 */

// ============================================
// NOTES
// ============================================

/**
 * ✅ IMPORTANT POINTS:
 * 
 * 1. isInternational parameter tells the delete function which provider to use
 *    - true = delete from Bunny
 *    - false = delete from Alibaba Cloud
 * 
 * 2. Always delete old files BEFORE deleting database records
 *    This prevents orphaned files in storage
 * 
 * 3. Use deleteFile() for single files (most common)
 *    Use deleteMultipleFiles() for batch operations
 *    Use deleteFileByPath() only if you don't have the full URL
 * 
 * 4. Handle errors gracefully - deletion might fail but database might not
 *    Consider logging failed deletions for manual cleanup
 * 
 * 5. The isInternational flag should come from:
 *    - req.body.isInternational (user selection)
 *    - User profile isInternational
 *    - Default to true if not specified
 */

/**
 * ❌ COMMON MISTAKES TO AVOID:
 * 
 * DON'T: Delete database record, then try to delete file
 *   - File URL might be lost if deletion fails
 * 
 * DO: Delete file first, then delete database record
 * 
 * ---
 * 
 * DON'T: Forget to pass isInternational parameter
 *   - Defaults to true, might delete from wrong provider
 * 
 * DO: Always ensure isInternational matches where file was uploaded
 * 
 * ---
 * 
 * DON'T: Assume deletion succeeded silently
 *   - Always handle try/catch and log failures
 * 
 * DO: Log deletion failures for manual cleanup
 */
