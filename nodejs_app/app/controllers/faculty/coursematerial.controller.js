const fs = require("fs").promises;
const mongoose = require("mongoose");

const CourseMaterial = require("../../models/Material");
const Faculty = require("../../models/FacultyProfile");
const Batch = require("../../models/Batch");
const cloudinary = require("../../config/cloudinary");

class courseMaterialController {

    async viewCourseMaterialUpload(req, res) {
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


            return res.render("faculty/faculty_add_coursematerial", {
                profile,
                showAllBatch,
                faculty,
            });
        } catch (error) {
            console.log(error.message);

            return res.redirect("/web/view/faculty/dashboard");
        }
    }

    async addCourseMaterial(req, res) {
        try {

            const profile = await Faculty.findOne({ userId: req.user.id });

            if (!profile) {
                req.flash("error", "Faculty profile not found");
                return res.redirect("back");
            }

            const {
                title,
                description,
                batchId
            } = req.body;

            const material = await CourseMaterial.create({
                title,
                description,
                batchId,
                facultyId: profile._id,
                
            });

            if (req.file) {
                console.log(req.file);
                const imageStore = await cloudinary.uploader.upload(req.file.path, {
                    folder: "coursematerial",
                });
                console.log(imageStore);
                await fs.unlink(req.file.path);
                material.fileUrl = imageStore.secure_url;
                material.filePublicId = imageStore.public_id;
            }


            console.log("req.file =", req.file);
console.log("body =", req.body);

            const savedCourseMaterial = await CourseMaterial.create(material);
            
            req.flash("success", "Course material added successfully");
            return res.redirect("/web/faculty/view/allcoursematerial");

        } catch (error) {
            console.log(error);
            req.flash("error", error.message);
            return res.redirect("/web/faculty/view/allcoursematerial");
        }
    }

    async viewAllCourseMaterial(req, res) {
        try {
            const id = req.user.id;

            const profile = await Faculty.findOne({ userId: req.user.id });

            const profileId = profile.id;

            const page = parseInt(req.query.page) || 1;
            const limit = 2;
            const skip = (page - 1) * limit;


            const totalCourseMaterial = await CourseMaterial.countDocuments({
                facultyId: profileId
            });

            const totalPages = Math.ceil(totalCourseMaterial / limit);

            const getCourseMaterialInfo = await CourseMaterial.aggregate([
                {
                    $match: {
                        facultyId: new mongoose.Types.ObjectId(profileId)
                    }
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
                    $skip: skip
                },
                {
                    $limit: limit
                }
            ]);


            return res.render("faculty/faculty_course_material", {
                getCourseMaterialInfo,
                profile,
                currentPage: page,
                totalPages
            });
        } catch (error) {
            console.log(error);
            req.flash("error", "Unable to load faculty list");
            return res.redirect("/web/view/login");
        }
    }

    async viewSingleCourseMaterial(req, res) {
        try {
        
              const materialId = req.params.id;
              const id = req.user.id;
              const profile = await Faculty.findOne({ userId: id });
        
              // console.log(id);
        
              const singleCourseMaterial = await CourseMaterial.aggregate([
                {
                  $match: {
                    _id: new mongoose.Types.ObjectId(materialId),
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
                    as: "studentList"
                  }
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
        
              console.log(singleCourseMaterial);
              // console.log(singleProject[0].studentList[0].address);
        
            //   return res.render("faculty/faculty_single_project", { singleProject });
        
            } catch (error) {
              console.log(error);
              req.flash("error", "Something went wrong while viewing coursematerial");
        
              return res.redirect("/web/view/add/faculty/list");
            }
    }
}

module.exports = new courseMaterialController()