const fs = require("fs").promises;
const mongoose = require("mongoose");

const Faculty = require("../../models/FacultyProfile");
const Batch = require("../../models/Batch");
const Project = require("../../models/Project");

const cloudinary = require("../../config/cloudinary");

class ProjectController {
  async viewProjectUploadDashboard(req, res) {
    try {
      const id = req.user.id;

      const profile = await Faculty.findOne({ userId: req.user.id });

      const profileId = profile.id;

      const faculty = await Faculty.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(profileId),
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userInfo",
          },
        },
        {
          $unwind: {
            path: "$userInfo",
            preserveNullAndEmptyArrays: true,
          },
        },
      ]);

      const showAllBatch = await Batch.aggregate([
        {
          $match: {
            facultyId: new mongoose.Types.ObjectId(profileId),
          },
        },
        {
          $lookup: {
            from: "faculties",
            localField: "facultyId",
            foreignField: "_id",
            as: "facultyInfo",
          },
        },
        { $unwind: "$facultyInfo" },
        {
          $lookup: {
            from: "courses",
            localField: "courseId",
            foreignField: "_id",
            as: "courseInfo",
          },
        },
        { $unwind: "$courseInfo" },
        // {
        //   $lookup: {
        //     from: "users",
        //     localField: "facultyInfo.userId",
        //     foreignField: "_id",
        //     as: "userInfo",
        //   },
        // },
        // { $unwind: "$userInfo" },
      ]);

      // console.log(showAllBatch);
      return res.render("faculty/faculty_add_project", {
        profile,
        showAllBatch,
        faculty,
      });
    } catch (error) {
      console.log(error.message);

      return res.redirect("/web/view/faculty/dashboard");
    }
  }

  async addProject(req, res) {
    try {
      const id = req.user.id;

      const profile = await Faculty.findOne({ userId: id });

      const {
        title,
        description,
        batchId,
        startDate,
        dueDate,
        githubRequired,
        status,
      } = req.body;

      console.log(req.body);

      const projectData = new Project({
        title,
        description,
        batchId,
        facultyId: profile.id,
        startDate,
        dueDate,
        githubRequired,
        status,
      });

      if (req.file) {
        console.log(req.file);
        const imageStore = await cloudinary.uploader.upload(req.file.path, {
          folder: "project",
        });
        console.log(imageStore);
        await fs.unlink(req.file.path);
        projectData.projectImage = imageStore.secure_url;
        projectData.projectImagePublicId = imageStore.public_id;
      }

      // console.log( projectData);

      await projectData.save();

      req.flash("success", "Project added successfully");
      return res.redirect("/web/faculty/allproject/view");
    } catch (error) {
      console.log(error);
      req.flash("error", "Something went wrong while adding project");

      return res.redirect("/web/view/faculty/dashboard");
    }
  }

  async viewAllProject(req, res) {
    try {
      const id = req.user.id;

      const profile = await Faculty.findOne({ userId: req.user.id });

      const profileId = profile.id;

      const page = parseInt(req.query.page) || 1;
      const limit = 5;
      const skip = (page - 1) * limit;

      const totalProjects = await Project.countDocuments({
        facultyId: profileId,
      });

      const totalPages = Math.ceil(totalProjects / limit);

      const getProjectInfo = await Project.aggregate([
        {
          $match: {
            facultyId: new mongoose.Types.ObjectId(profileId),
          },
        },
        {
          $lookup: {
            from: "faculties",
            localField: "facultyId",
            foreignField: "_id",
            as: "facultyInfo",
          },
        },
        {
          $lookup: {
            from: "batches",
            localField: "batchId",
            foreignField: "_id",
            as: "batchInfo",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "facultyInfo.userId",
            foreignField: "_id",
            as: "userInfo",
          },
        },
        { $unwind: "$facultyInfo" },
        { $unwind: "$batchInfo" },
        { $unwind: "$userInfo" },
        {
          $skip: skip,
        },
        {
          $limit: limit,
        },
      ]);

      return res.render("faculty/faculty_project", {
        getProjectInfo,
        profile,
        currentPage: page,
        totalPages,
      });
    } catch (error) {
      console.log(error);
      req.flash("error", "Unable to load faculty list");
      return res.redirect("/web/view/login");
    }
  }

  async viewFacultyBatch(req, res) {
    try {
      // console.log("Starting");
      const id = req.user.id;
      const profile = await Faculty.findOne({ userId: id });

      // console.log(id);

      const findBatch = await Batch.aggregate([
        {
          $lookup: {
            from: "courses",
            localField: "courseId",
            foreignField: "_id",
            as: "courseList",
          },
        },
        {
          $lookup: {
            from: "faculties",
            localField: "facultyId",
            foreignField: "_id",
            as: "facultyList",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "facultyList.userId",
            foreignField: "_id",
            as: "userInfo",
          },
        },
        {
          $match: {
            "facultyList.userId": new mongoose.Types.ObjectId(id),
          },
        },

        {
          $unwind: {
            path: "$courseList",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: "$facultyList",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: "$userInfo",
            preserveNullAndEmptyArrays: true,
          },
        },
      ]);

      // console.log(JSON.stringify(findBatch, null, 2));
      // console.log(findBatch);

      return res.render("faculty/faculty_batch", { findBatch, profile });
    } catch (error) {
      req.flash("error", "Something went wrong while listing batch");
      return res.redirect("/web/view/faculty/dashboard");
    }
  }

  async viewFacultySingleProject(req, res) {
    try {
      const projectId = req.params.id;
      const id = req.user.id;
      const profile = await Faculty.findOne({ userId: id });

      // console.log(id);

      const singleProject = await Project.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(projectId),
            facultyId: new mongoose.Types.ObjectId(profile._id),
          },
        },
        {
          $lookup: {
            from: "faculties",
            localField: "facultyId",
            foreignField: "_id",
            as: "facultyList",
          },
        },
        {
          $lookup: {
            from: "batches",
            localField: "batchId",
            foreignField: "_id",
            as: "batchList",
          },
        },
        {
          $lookup: {
            from: "courses",
            localField: "batchList.courseId",
            foreignField: "_id",
            as: "courseInfo",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "facultyList.userId",
            foreignField: "_id",
            as: "userInfo",
          },
        },
        {
          $lookup: {
            from: "departments",
            localField: "facultyList.deptId",
            foreignField: "_id",
            as: "departmentInfo",
          },
        },
        {
          $lookup: {
            from: "students",
            localField: "batchId",
            foreignField: "batchId",
            as: "studentList",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "studentList.userId",
            foreignField: "_id",
            as: "studentInfo",
          },
        },
        {
          $unwind: {
            path: "$facultyList",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: "$userInfo",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: "$departmentInfo",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: "$batchList",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: "$courseInfo",
            preserveNullAndEmptyArrays: true,
          },
        },
      ]);

      // console.log(singleProject);
      // console.log(singleProject[0].studentList[0].address);

      return res.render("faculty/faculty_single_project", { singleProject });
    } catch (error) {
      console.log(error);
      req.flash("error", "Something went wrong while viewing faculty");

      return res.redirect("/web/view/add/faculty/list");
    }
  }

  async viewProjectEdit(req, res) {
    try {
      const projectId = req.params.id;
      const id = req.user.id;
      const profile = await Faculty.findOne({ userId: id });

      // console.log(id);

      const singleProject = await Project.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(projectId),
            facultyId: new mongoose.Types.ObjectId(profile._id),
          },
        },
      ]);

      // console.log(singleProject);
      // console.log(singleProject[0].studentList[0].address);

      return res.render("faculty/project_edit", { singleProject });
    } catch (error) {
      console.log(error);
      req.flash("error", "Something went wrong while viewing faculty");

      return res.redirect("/web/view/add/faculty/list");
    }
  }

  async projectUpdate(req, res) {
    try {
      const projectId = req.params.id;

      const profile = await Faculty.findOne({ userId: req.user.id });

      const singleProject = await Project.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(projectId),
          },
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
          $project: {
            title: 1,
            description: 1,
            batchId: 1,
            batchName: "$batch.name",
          },
        },
      ]);

      console.log(singleProject);

      const {
        title,
        description,
        batchId,
        startDate,
        dueDate,
        githubRequired,
        status,
      } = req.body;

      // find existing project
      const project = await Project.findById(projectId);

      if (!project) {
        req.flash("error", "Project not found");
        return res.redirect("/web/faculty/allproject/view");
      }

      // update fields
      project.title = title || project.title;
      project.description = description || project.description;
      project.batchId = singleProject[0].batchId;
      project.facultyId = profile.id || project.facultyId;
      project.startDate = startDate || project.startDate;
      project.dueDate = dueDate || project.dueDate;
      project.githubRequired = githubRequired || project.githubRequired;
      project.status = status || project.status;

      // IMAGE UPDATE (if new file uploaded)
      if (req.file) {
        console.log("New file:", req.file);

        // delete old image from cloudinary
        if (project.projectImagePublicId) {
          await cloudinary.uploader.destroy(project.projectImagePublicId);
        }

        // upload new image
        const imageStore = await cloudinary.uploader.upload(req.file.path, {
          folder: "project",
        });

        // delete local file
        await fs.unlink(req.file.path);

        // update DB fields
        project.projectImage = imageStore.secure_url;
        project.projectImagePublicId = imageStore.public_id;
      }

      await project.save();

      req.flash("success", "Project updated successfully");
      return res.redirect("/web/faculty/allproject/view");
    } catch (error) {
      console.log(error);

      req.flash("error", "Something went wrong while updating project");
      return res.redirect("/web/view/faculty/dashboard");
    }
  }

  async projectDelete(req, res) {
    try {
      const id = req.params.id;

      // const profile = await Faculty.findOne({ userId: req.user.id });

      const presentData = await Project.findById(id);

      if (presentData.projectImagePublicId) {
        await cloudinary.uploader.destroy(presentData.projectImagePublicId);
      }

      await Project.findByIdAndDelete(id);

      req.flash("success", "Project deleted successfully");
      return res.redirect("/web/faculty/allproject/view");
      
    } catch (error) {
      console.log(error);

      req.flash("error", "Something went wrong while updating project");
      return res.redirect("/web/view/faculty/dashboard");
    }
  }
}

module.exports = new ProjectController();
