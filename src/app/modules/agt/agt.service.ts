import { ApiError } from "../../errors/ApiError";
import Progress from "../progress/progress.model";
import { IAssignmentSubmission } from "./agt.interface";
import AssignmentSubmission from "./Agt.model";

export const AssignmentSubmissionService = {
  async createSubmission(data: Partial<IAssignmentSubmission>) {
    const existing = await AssignmentSubmission.findOne({
      student: data.student,
      lesson: data.lesson,
    });

    if (existing) throw new ApiError(400, "Submission already exists");

    return AssignmentSubmission.create(data);
  },

  async getSubmissionById(id: string) {
    const submission = await AssignmentSubmission.findById(id)
      .populate("student", "name email")
      .populate("lesson", "title assignment")
      .populate("course", "title");

    if (!submission) throw new ApiError(404, "Submission not found");
    return submission;
  },



 async getAllSubmissions(query: any = {}) {
    const page = parseInt(query.page as string) || 1;
    const limit = parseInt(query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const filter: any = {};

    // Filter by status
    if (query.status) filter.status = query.status;

    // Filter by submissionType
    if (query.submissionType) filter.submissionType = query.submissionType;

    // Filter by course
    if (query.course) filter.course = query.course;

    // Filter by lesson
    if (query.lesson) filter.lesson = query.lesson;

    // Search by student name or email
    const search = query.search ? query.search.trim() : null;

    let submissionsQuery = AssignmentSubmission.find(filter)
      .populate("student", "name email")
      .populate("lesson", "title assignment")
      .populate("course", "title")
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(limit);

    if (search) {
      submissionsQuery = submissionsQuery.where({
        $or: [
          { "student.name": { $regex: search, $options: "i" } },
          { "student.email": { $regex: search, $options: "i" } },
        ],
      });
    }

    const [submissions, total] = await Promise.all([
      submissionsQuery.exec(),
      AssignmentSubmission.countDocuments(filter),
    ]);

    return {
      submissions,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },










  async updateSubmission(
    id: string,
    data: Partial<IAssignmentSubmission>
  ) {
    const updated = await AssignmentSubmission.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!updated) throw new ApiError(404, "Submission not found");
    return updated;
  },

  async deleteSubmission(id: string) {
    const deleted = await AssignmentSubmission.findByIdAndDelete(id);
    if (!deleted) throw new ApiError(404, "Submission not found");
    return deleted;
  },

  // -----------------------
  // Admin review (give marks/feedback)
  // -----------------------
  async reviewSubmission(
    id: string,
    marks: number,
    feedback: string,
    status: "reviewed" | "graded" = "graded"
  ) {
    const submission = await AssignmentSubmission.findById(id);
    if (!submission) throw new ApiError(404, "Submission not found");

    submission.result = marks;
    submission.feedback = feedback;
    submission.status = status;
    await submission.save();


    const progress = await Progress.findOne({
      student: submission.student,
      course: submission.course,
    });

    if (progress && status === "graded") {
      await progress.updateWithAssignment(submission._id.toString());
    }




    return submission;
  },
};
