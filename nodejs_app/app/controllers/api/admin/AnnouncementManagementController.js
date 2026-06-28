const mongoose = require("mongoose");
const Batch = require("../../models/Batch");
const User = require("../../models/User");
const Faculty = require("../../models/FacultyProfile");
const Student = require("../../models/StudentProfile");
const Announcement = require("../../models/Announcement");

const httpStatusCode = require("../../../utils/httpStatusCode");


class AnnouncementManagementController {

    async viewAnnouncementList(req, res) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = 3;
            const skip = (page - 1) * limit;
            const search = req.query.search || "";

            const showAnnouncement = await Announcement.aggregate([
                {
                    $match: {
                        title: {
                            $regex: search,
                            $options: "i",
                        },
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
                    $unwind: {
                        path: "$batchInfo",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "createdBy",
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
                { $skip: skip },
                { $limit: limit },
            ]);


            // Count matching announcement
            const totalAnnouncements = await Announcement.aggregate([
                {
                    $match: {
                        title: {
                            $regex: search,
                            $options: "i",
                        },
                    },
                },
                {
                    $count: "total",
                },
            ]);

            const totalRecords =
                totalAnnouncements.length > 0 ? totalAnnouncements[0].total : 0;

            const totalPages = Math.ceil(totalRecords / limit);

            return res.status(httpStatusCode.OK).json({
                success: true,
                message: "Batch gets successfully",
                showAnnouncement,
                currentPage: page,
                totalPages,
                search,
            });
        } catch (error) {

            return res.status(httpStatusCode.SERVER_ERROR).json({
                success: false,
                message: error.message
            });
        }
    }

    //   async viewAddAnnouncement(req, res) {
    //     const listBatch = await Batch.find({});
    //     return res.render("admin/add_announcement", { listBatch });
    //   }

    async createAnnouncement(req, res) {
        try {

            //   console.log(req.body);

            const { title, description, announcementType, batchId, status } = req.body;

            // if type is batch, batchId must be provided

            if (announcementType === "batch" && !batchId) {

                return res.status(httpStatusCode.BAD_REQUEST).json({
                    success: false,
                    message: "Invalid announcementType"
                });

            }

            const announcement = await Announcement.create({
                title,
                description,
                announcementType,
                batchId: announcementType === "batch" ? batchId : null,
                status,
                createdBy: req.user.id,
            });

            return res.status(httpStatusCode.CREATED).json({
                success: true,
                message: "Announcement created successfully",
                data: announcement
            });

        } catch (error) {
            return res.status(httpStatusCode.SERVER_ERROR).json({
                success: false,
                message: error.message
            });
        }
    }

    async viewEditAnnouncement(req, res) {
        try {
            const id = req.params.id;
            const listBatches = await Batch.find({});
            const showAnnouncements = await Announcement.findById(id);

            return res.status(httpStatusCode.OK).json({
                success: true,
                message: "Announcements gets successfully",
                showAnnouncements,
                listBatches,
            });

        } catch (error) {
            return res.status(httpStatusCode.SERVER_ERROR).json({
                success: false,
                message: error.message
            });
        }
    }

    async updateAnnouncement(req, res) {
        try {
            const id = req.params.id;

            const updateData = { ...req.body };
            if (updateData.announcementType !== "batch") {
                updateData.batchId = null;
            }
            const result = await Announcement.findByIdAndUpdate(id, updateData, { new: true });

            return res.status(httpStatusCode.OK).json({
                success: true,
                message: "Announcement updated successfully",
                data: result
            })

        } catch (error) {
            return res.status(httpStatusCode.SERVER_ERROR).json({
                success: false,
                message: error.message
            });
        }
    }

    async deleteAnnouncement(req, res) {
        try {
            const id = req.params.id;
            const deleteData = await Announcement.findByIdAndDelete(id);

            return res.status(httpStatusCode.OK).json({
                success: true,
                message: "Announcement deleted successfully"
            })

        } catch (error) {
            return res.status(httpStatusCode.SERVER_ERROR).json({
                success: false,
                message: error.message
            });
        }
    }

    async viewAnnouncement(req, res) {
        try {
            const id = req.params.id;
            const listBatches = await Batch.find({});
            // const showAnnouncements = await Announcement.findById(id);
            const showAnnouncements = await Announcement.aggregate([
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(id),
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
                    $unwind: {
                        path: "$batchInfo",
                        preserveNullAndEmptyArrays: true,
                    },
                },

                {
                    $lookup: {
                        from: "users",
                        localField: "createdBy",
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
            return res.status(httpStatusCode.OK).json({
                success: true,
                message: "Announcements get successfully",
                showAnnouncements,
                listBatches,
            });

        } catch (error) {
            return res.status(httpStatusCode.SERVER_ERROR).json({
                success: false,
                message: error.message
            });
        }
    }
}


module.exports = new AnnouncementManagementController();
