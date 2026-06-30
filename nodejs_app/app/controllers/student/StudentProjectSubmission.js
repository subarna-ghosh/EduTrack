const fs = require("fs").promises;
const cloudinary = require("../../config/cloudinary");
const Student = require("../../models/StudentProfile");
const User = require("../../models/User");
const Fee = require("../../models/Fee");
const Payment = require("../../models/Payment");
const Batch = require("../../models/Batch");
const BatchSchedule = require("../../models/BatchSchedule");
const Project = require("../../models/Project");
const ProjectSubmission = require("../../models/ProjectSubmission");
class StudentProjectSubmission {
  async viewProjectSubmission(req, res) {
    try {
      const findUser = await User.findById(req.user.id);
      const findStudent = await Student.findOne({
        userId: findUser._id,
      });
      if (!findStudent) {
        req.flash("error", "Student not found.");
        return res.redirect("back");
      }
      const projectList = await Project.aggregate([
        {
          $match: {
            batchId: findStudent.batchId,
            status: "active",
          },
        },
        {
          $lookup: {
            from: "faculties",
            localField: "facultyId",
            foreignField: "_id",
            as: "faculty",
          },
        },
        {
          $unwind: "$faculty",
        },
        {
          $lookup: {
            from: "users",
            localField: "faculty.userId",
            foreignField: "_id",
            as: "userName",
          },
        },
        {
          $unwind: "$userName",
        },
        {
          $lookup: {
            from: "batches",
            localField: "batchId",
            foreignField: "_id",
            as: "batch",
          },
        },
        {
          $unwind: "$batch",
        },
        {
          $lookup: {
            from: "projectsubmissions",
            let: {
              projectId: "$_id",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$projectId", "$$projectId"] },
                      { $eq: ["$studentId", findStudent._id] },
                    ],
                  },
                },
              },
            ],
            as: "submission",
          },
        },
        {
          $addFields: {
            isSubmitted: {
              $gt: [{ $size: "$submission" }, 0],
            },
          },
        },
        {
          $project: {
            title: 1,
            description: 1,
            startDate: 1,
            dueDate: 1,
            githubRequired: 1,
            status: 1,
            projectImage: 1,
            facultyName: "$userName.name",
            batchName: "$batch.batchName",
            isSubmitted: 1,
          },
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
      ]);

      return res.render("student/student_project_submission", {
        projectList,
        student: req.user,
        navValue: "Project",
      });
    } catch (err) {
      console.log(err);
      req.flash("error", "Something went wrong.");
      return res.redirect("/web/view/student/dashboard");
    }
  }

  async submitProject(req, res) {
    try {
      const { projectId, githubLink, remarks } = req.body;
      const findUser = await User.findById(req.user.id);
      const findStudent = await Student.findOne({
        userId: findUser._id,
      });

      if (!findStudent) {
        req.flash("error", "Student not found.");
        return res.redirect("/web/view/student/project/submission");
      }

      const findProject = await Project.findById(projectId);
      if (!findProject) {
        req.flash("error", "Project not found.");
        return res.redirect("/web/view/student/project/submission");
      }

      const alreadySubmitted = await ProjectSubmission.findOne({
        projectId,
        studentId: findStudent._id,
      });

      if (alreadySubmitted) {
        req.flash("error", "Project already submitted.");
        return res.redirect("/web/view/student/project/submission");
      }

      let submissionFile = null;
      let submissionFilePublicId = null;

      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "project-submissions",
        });

        submissionFile = result.secure_url;
        submissionFilePublicId = result.public_id;

        await fs.unlink(req.file.path);
      }

      await ProjectSubmission.create({
        projectId,
        studentId: findStudent._id,
        githubLink,
        remarks,
        submissionFile,
        submissionFilePublicId,
        marks: 0,
        status: "submitted",
      });

      req.flash("success", "Project submitted successfully.");

      return res.redirect("/web/view/student/project/submission");
    } catch (err) {
      console.log(err);

      req.flash("error", "Something went wrong.");

      return res.redirect("/web/view/student/project/submission");
    }
  }

  viewStudentMaterial(req, res) {
    return res.render("student/student_view_material",{student: req.user,navValue: "Materials",});
  }
}
module.exports = new StudentProjectSubmission();
