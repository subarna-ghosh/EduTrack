const fs = require("fs").promises;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Role = require("../../../models/Role");
const User = require("../../../models/User");
const Faculty = require("../../../models/FacultyProfile");
const Department = require("../../../models/Department");
const cloudinary = require("../../../config/cloudinary");
const sendEmail = require("../../../utils/postmanApi/sendMail");
const httpStatusCode = require("../../../utils/httpStatusCode");



class FacultyManagementController {

    async createDepartment(req, res) {
        try {

            const { deptName } = req.body;

            if (!deptName) {
                return res.status(httpStatusCode.BAD_REQUEST).json({
                    success: false,
                    message: "deptName are required"
                })
            }

            const existingDepartment = await Department.findOne({ deptName });

            if (existingDepartment) {
                return res.status(httpStatusCode.BAD_REQUEST).json({
                    success: false,
                    message: "Department already exist",
                });
            }

            const newDepartment = new Department({ deptName });

            const result = await newDepartment.save();

            return res.status(httpStatusCode.OK).json({
                success: true,
                message: "Department created successfully",
                data: result
            });

        } catch (error) {
            return res.status(httpStatusCode.SERVER_ERROR).json({
                success: false,
                message: error.message
            });
        }
    }

    async createFaculty(req, res) {
        try {
            const {
                name,
                email,
                phone,
                password,
                address,
                deptId,
                experience,
                status,
            } = req.body;

            // Check duplicate email

            const existingFaculty = await User.findOne({ email });

            if (existingFaculty) {
                return res.status(httpStatusCode.BAD_REQUEST).json({
                    success: false,
                    message: "Faculty already exist",
                });
            }

            // Find faculty role

            const facultyRole = await Role.findOne({ roleName: "faculty" });

            if (!facultyRole) {
                return res.status(httpStatusCode.NOT_FOUND).json({
                    success: false,
                    message: "Faculty role not found in DB"
                });
            }

            // Hash password

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create User

            const newUser = await User.create({
                name,
                email,
                password: hashedPassword,
                roleId: facultyRole._id,
                status,
            });

            try {
                // Create Faculty

                const newFaculty = {
                    userId: newUser._id,
                    phone,
                    address,
                    deptId,
                    experience,
                    status,
                };

                // Upload image if exists
                if (req.file) {
                    console.log(req.file);
                    const imageStore = await cloudinary.uploader.upload(req.file.path, {
                        folder: "faculty",
                    });
                    // console.log(imageStore);

                    await fs.unlink(req.file.path);
                    newFaculty.profileImage = imageStore.secure_url;
                    newFaculty.profileImagePublicId = imageStore.public_id;
                }

                // Save Faculty

                const savedFaculty = await Faculty.create(newFaculty);

                // Send Email after everything succeeds

                await sendEmail(req, {
                    name,
                    email,
                    password, // plain password if needed in email
                });

                return res.status(httpStatusCode.OK).json({
                    success: false,
                    message: "Faculty created successfully",
                    data: savedFaculty
                });
            } catch (facultyError) {
                // Rollback User if Faculty creation fails

                await User.findByIdAndDelete(newUser._id);

                return res.status(httpStatusCode.SERVER_ERROR).json({
                    success: false,
                    message: facultyError.message
                });
            }
        } catch (error) {
            return res.status(httpStatusCode.SERVER_ERROR).json({
                success: false,
                message: error.message
            });
        }
    }

    async viewAllFaculty(req, res) {
        try {
            const getFacultyInfo = await Faculty.aggregate([
                {
                    $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "userInfo",
                    },
                },
                {
                    $unwind: "$userInfo"
                },
                {
                    $lookup: {
                        from: "departments",
                        localField: "deptId",
                        foreignField: "_id",
                        as: "deptInfo",
                    },
                },
                {
                    $unwind: "$deptInfo"
                },
            ]);

            return res.status(httpStatusCode.OK).json({
                success: true,
                message: "Faculties get successfully",
                data: getFacultyInfo
            });

        } catch (error) {
            return res.status(httpStatusCode.SERVER_ERROR).json({
                success: false,
                message: error.message
            });
        }
    }

    async facultyProfile(req, res) {
        try {
            const id = req.params.id;
            const showFacultyProfile = await Faculty.aggregate([
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(id),
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
                    $unwind: "$userInfo"
                },
                {
                    $lookup: {
                        from: "departments",
                        localField: "deptId",
                        foreignField: "_id",
                        as: "deptInfo",
                    },
                },
                { $unwind: "$deptInfo" }
            ]);

            return res.status(httpStatusCode.OK).json({
                success: true,
                message: "Faculty Profile gets successfully",
                facultyProfile: showFacultyProfile
            });
        } catch (error) {
            return res.status(httpStatusCode.SERVER_ERROR).json({
                success: false,
                message: error.message
            });
        }
    }

    async editFacultyView(req, res) {
        try {
            const id = req.params.id;
            const showData = await Faculty.aggregate([
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(id),
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
                    $unwind: "$userInfo"
                },
                {
                    $lookup: {
                        from: "departments",
                        localField: "deptId",
                        foreignField: "_id",
                        as: "deptInfo",
                    },
                },
                { $unwind: "$deptInfo" }
            ]);

            const selectDept = await Department.find();

            return res.status(httpStatusCode.OK).json({
                success: true,
                message: "Faculty gets successfully",
                showData,
                selectDept
            });

        } catch (error) {
            return res.status(httpStatusCode.SERVER_ERROR).json({
                success: false,
                message: error.message
            });
        }
    }

    async updateFaculty(req, res) {
        try {
            const id = req.params.id;
            const isExist = await Faculty.findById(id);

            if (!isExist) {
                return res.status(httpStatusCode.NOT_FOUND).json({
                    success: false,
                    message: "Faculty does not found"
                });
            }

            if (req.file) {
                // Deletes old image only when a new image is uploaded
                if (isExist.profileImagePublicId) {
                    await cloudinary.uploader.destroy(isExist.profileImagePublicId);
                }
                const data = await cloudinary.uploader.upload(req.file.path, {
                    folder: "faculty",
                });
                await fs.unlink(req.file.path);
                req.body.profileImage = data.secure_url;
                req.body.profileImagePublicId = data.public_id;
            }
            const updatedFaculty = await Faculty.findByIdAndUpdate(id, req.body, {
                new: true,
            });
            return res.status(httpStatusCode.OK).json({
                success: true,
                message: "Batch updates successfully",
                updatedFaculty
            });

        } catch (error) {
            return res.status(httpStatusCode.SERVER_ERROR).json({
                success: false,
                message: error.message
            });
        }
    }

    async deleteFaculty(req, res) {
        try {
            const id = req.params.id;
            const presentData = await Faculty.findById(id);

            if (!presentData) {
                return res.status(httpStatusCode.NOT_FOUND).json({
                    success: false,
                    message: "Faculty not found"
                });
            }
            if (presentData.profileImagePublicId) {
                await cloudinary.uploader.destroy(presentData.profileImagePublicId);
            }

            await Faculty.findByIdAndDelete(id);

            return res.status(httpStatusCode.OK).json({
                success: true,
                message: "Faculty deleted successfully"

            });
        } catch (error) {
            return res.status(httpStatusCode.SERVER_ERROR).json({
                success: false,
                message: error.message
            });
        }
    }
}
module.exports = new FacultyManagementController();
