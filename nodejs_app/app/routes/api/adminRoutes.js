const express = require("express");
const router = express.Router();

const AdminController = require("../../controllers/api/admin/AdminController");
const StudentManagementController = require("../../controllers/api/admin/StudentManagementController");
const FacultyManagementController = require("../../controllers/api/admin/FacultyManagementController");
const BatchManagementController = require("../../controllers/api/admin/BatchManagementController");
const CourseManagementController = require("../../controllers/api/admin/CourseManagementController");
// const PaymentManagementController = require("../../controllers/postmanApi/admin/PaymentManagementController");

const authCheck = require("../../middlewares/api/authCheck");
const roleCheck = require("../../middlewares/api/roleCheck");
const validateApi = require("../../middlewares/validateApiMiddleware");

const uploadProfileImage = require("../../utils/uploadImage");

const { courseSchema } = require("../../validations/courseValidation");
const { departmentSchema, facultySchema } = require("../../validations/facultyValidation");
const { studentSchema } = require("../../validations/studentValidation");
const { batchSchema } = require("../../validations/batchValidation");


// admin dashboard

/**
 * @swagger
 * /api/view/admin/dashboard:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get admin dashboard
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Data fetched successfully.
 *       500:
 *         description: Server error
 */

router.get("/view/admin/dashboard",
  authCheck,
  roleCheck("admin"),
  AdminController.viewAdminDashboard
);


// department

/**
 * @swagger
 * /api/save/department:
 *   post:
 *     summary: Create a new department
 *     tags:
 *       - Department
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - deptName
 *             properties:
 *               deptName:
 *                 type: string              
 *     responses:
 *       201:
 *         description: Department created successfully
 *       400:
 *         description: Bad Request - Missing fields
 *       500:
 *         description: Server error
 */

router.post("/save/department",
  authCheck,
  roleCheck("admin"),
  validateApi(departmentSchema),
  FacultyManagementController.createDepartment
);



// faculty

/**
 * @swagger
 * /api/create/faculty:
 *   post:
 *     tags:
 *       - Faculty
 *     summary: Create Faculty
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - password
 *               - address
 *               - deptId
 *               - experience              
 *             properties:
 *               name:
 *                 type: string                 
 *               email:
 *                 type: string
 *                 format: email                
 *               phone:
 *                 type: string                
 *               password:
 *                 type: string
 *                 format: password                 
 *               address:
 *                 type: string             
 *               deptId:
 *                 type: string                              
 *               status:
 *                 type: string
 *                 enum:
 *                   - active
 *                   - inactive           
 *               profileImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Faculty created successfully
 *       400:
 *         description: Bad Request - Missing fields
 *       500:
 *         description: Server error
 */

router.post(
  "/create/faculty",
  authCheck,
  roleCheck("admin"),
  uploadProfileImage.single("profileImage"),
  validateApi(facultySchema),
  FacultyManagementController.createFaculty
);

/**
 * @swagger
 * /api/view/allfaculty:
 *  get: 
 *    summary: Get all faculty (admin only)                                          
 *    tags:
 *       - Faculty
 *    security:
 *       - BearerAuth: []
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: data fetched successfully.
 *      500: 
 *        description: Server error
 */

router.get("/view/allfaculty",
  authCheck,
  roleCheck("admin"),
  FacultyManagementController.viewAllFaculty
);


/**
 * @swagger
 * /api/faculty/profile/view/{id}:
 *   get:
 *     tags:
 *       - Faculty
 *     summary: View Faculty Profile
 *     description: Get a faculty profile by Faculty ID. Only Admin can access this API.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Faculty ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Faculty profile fetched successfully.
 *       400:
 *         description: Invalid Faculty ID.
 *       401:
 *         description: Unauthorized. Token is missing or invalid.
 *       403:
 *         description: Access denied. Admin only.
 *       404:
 *         description: Faculty not found.
 *       500:
 *         description: Internal server error.
 */

router.get(
  "/faculty/profile/view/:id",
  authCheck,
  roleCheck("admin"),
  FacultyManagementController.facultyProfile
);


/**
 * @swagger
 * /api/edit/faculty/view/{id}:
 *   get:
 *     tags:
 *       - Faculty
 *     summary: View Faculty Profile
 *     description: Get a faculty profile by Faculty ID. Only Admin can access this API.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Faculty ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Faculty profile fetched successfully.
 *       400:
 *         description: Invalid Faculty ID.
 *       401:
 *         description: Unauthorized. Token is missing or invalid.
 *       403:
 *         description: Access denied. Admin only.
 *       404:
 *         description: Faculty not found.
 *       500:
 *         description: Internal server error.
 */

router.get(
  "/edit/faculty/view/:id",
  authCheck,
  roleCheck("admin"),
  FacultyManagementController.editFacultyView
);

/**
 * @swagger
 * /api/update/faculty/{id}:
 *   put:
 *     tags:
 *       - Faculty
 *     summary: Update Faculty
 *     description: Update faculty details including profile image.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Faculty ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               deptId:
 *                 type: string              
 *               experience:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum:
 *                   - active
 *                   - inactive
 *               profileImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Faculty updated successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Faculty not found.
 *       500:
 *         description: Internal Server Error.
 */

router.put(
  "/update/faculty/:id",
  authCheck,
  roleCheck("admin"),
  uploadProfileImage.single("profileImage"),
  FacultyManagementController.updateFaculty
);


/**
 * @swagger
 * /api/delete/faculty/{id}:
 *   delete:
 *     tags:
 *       - Faculty
 *     summary: Delete Faculty
 *     description: Delete a faculty by ID. Only Admin can access this API.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Faculty ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Faculty deleted successfully.
 *       400:
 *         description: Invalid Faculty ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       403:
 *         description: Forbidden. Admin access only.
 *       404:
 *         description: Faculty not found.
 *       500:
 *         description: Internal server error.
 */

router.delete(
  "/delete/faculty/:id",
  authCheck,
  roleCheck("admin"),
  FacultyManagementController.deleteFaculty,
);



// student


/**
 * @swagger
 * /api/create/student:
 *   post:
 *     tags:
 *       - Student
 *     security:
 *       - bearerAuth: []
 *     summary: Create Student
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: name
 *         type: string
 *         required: true
 *       - in: formData
 *         name: email
 *         type: string
 *         required: true
 *       - in: formData
 *         name: phone
 *         type: string
 *         required: true
 *       - in: formData
 *         name: password
 *         type: string
 *         required: true
 *       - in: formData
 *         name: address
 *         type: string
 *         required: true
 *       - in: formData
 *         name: batchId
 *         type: string
 *         required: true
 *         description: Batch Id (MongoDB ObjectId)
 *       - in: formData
 *         name: studentCode
 *         type: integer
 *         required: true
 *       - in: formData
 *         name: status
 *         type: boolean
 *         required: true
 *       - in: formData
 *         name: profileImage
 *         type: file
 *         required: false
 *         description: Student Profile Image
 *     responses:
 *       201:
 *         description: Student created successfully
 *       400:
 *         description: Bad Request - Missing fields
 *       500:
 *         description: Server error
 */

router.post(
  "/create/student",
  authCheck,
  roleCheck("admin"),
  validateApi(studentSchema),
  uploadProfileImage.single("profileImage"),
  StudentManagementController.createStudent,
);


/**
 * @swagger
 * /api/view/allstudent:
 *  get: 
 *    summary: Get all student                                          
 *    tags:
 *       - Student
 *    security:
 *       - BearerAuth: []
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: data fetched successfully.
 *      500: 
 *        description: Server error
 */

router.get(
  "/view/allstudent",
  authCheck,
  roleCheck("admin"),
  StudentManagementController.viewAllStudent,
);


/**
 * @swagger
 * /api/view/student/{id}:
 *   get:
 *     tags:
 *       - Student
 *     summary: View student Profile
 *     description: Get a student profile by Student ID. Only Admin can access this API.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Faculty ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Faculty profile fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Faculty profile fetched successfully.
 *                 data:
 *                   type: object
 *       400:
 *         description: Invalid Faculty ID.
 *       401:
 *         description: Unauthorized. Token is missing or invalid.
 *       403:
 *         description: Access denied. Admin only.
 *       404:
 *         description: Faculty not found.
 *       500:
 *         description: Internal server error.
 */

router.get(
  "/view/student/:id",
  authCheck,
  roleCheck("admin"),
  StudentManagementController.studentProfileById
);


/**
 * @swagger
 * /api/edit/student/{id}:
 *   get:
 *     tags:
 *       - Student
 *     summary: View Student Profile
 *     description: Get a student profile by Student ID. Only Admin can access this API.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Student ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Student profile fetched successfully.
 *       400:
 *         description: Invalid Faculty ID.
 *       401:
 *         description: Unauthorized. Token is missing or invalid.
 *       403:
 *         description: Access denied. Admin only.
 *       404:
 *         description: Student not found.
 *       500:
 *         description: Internal server error.
 */

router.get(
  "/edit/student/:id",
  authCheck,
  roleCheck("admin"),
  StudentManagementController.viewEditStudent,
);

// router.put(
//   "/update/student/:id",
//   authCheck,
//   roleCheck("admin"),
//   uploadProfileImage.single("profileImage"),
//   StudentManagementController.updateStudent
// );



/**
 * @swagger
 * /api/delete/student/{id}:
 *   delete:
 *     tags:
 *       - Student
 *     summary: Delete Student
 *     description: Delete a Student by ID. Only Admin can access this API.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Student ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Student deleted successfully.
 *       400:
 *         description: Invalid Student ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       403:
 *         description: Forbidden. Admin access only.
 *       404:
 *         description: Faculty not found.
 *       500:
 *         description: Internal server error.
 */

router.delete(
  "/delete/student/:id",
  authCheck,
  roleCheck("admin"),
  StudentManagementController.deleteStudent
);


// course

/**
 * @swagger
 * /api/save/course:
 *   post:
 *     tags:
 *       - Course
 *     summary: Create a new course
 *     description: Create a new course
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseName
 *               - duration
 *               - fees
 *               - description
 *               - status
 *             properties:
 *               courseName:
 *                 type: string                
 *               duration:
 *                 type: string                 
 *               fees:
 *                 type: number                 
 *               description:
 *                 type: string                
 *               status:
 *                 type: string
 *                 enum:
 *                   - active
 *                   - inactive
 *     responses:
 *       201:
 *         description: Course created successfully
 *       400:
 *         description: Bad Request - Missing or invalid fields
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal Server Error
 */

router.post("/save/course",
  authCheck,
  roleCheck("admin"),
  validateApi(courseSchema),
  CourseManagementController.createCourse,
);


/**
 * @swagger
 * /api/view/add/course:
 *  get: 
 *    summary: Get all course                                    
 *    tags:
 *       - Course
 *    security:
 *       - BearerAuth: []
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: data fetched successfully.
 *      500: 
 *        description: Server error
 */

router.get("/view/add/course",
  authCheck,
  roleCheck("admin"),
  CourseManagementController.viewAllCourse
);


/**
 * @swagger
 * /api/edit/course/{id}:
 *   get:
 *     tags:
 *       - Course
 *     summary: View Course Profile
 *     description: Get a Course by Course ID. Only Admin can access this API.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Course ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course fetched successfully.
 *       400:
 *         description: Invalid Course ID.
 *       401:
 *         description: Unauthorized. Token is missing or invalid.
 *       403:
 *         description: Access denied. Admin only.
 *       404:
 *         description: Course not found.
 *       500:
 *         description: Internal server error.
 */

router.get(
  "/edit/course/:id",
  authCheck,
  roleCheck("admin"),
  CourseManagementController.viewCourseEdit
);


router.put(
  "/update/course/:id",
  authCheck,
  roleCheck("admin"),
  CourseManagementController.courseUpdate
);



/**
 * @swagger
 * /api/delete/course/{id}:
 *   delete:
 *     tags:
 *       - Course
 *     summary: Delete Course
 *     description: Delete a Course by ID. Only Admin can access this API.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Course ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course deleted successfully.
 *       400:
 *         description: Invalid Course ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       403:
 *         description: Forbidden. Admin access only.
 *       404:
 *         description: Faculty not found.
 *       500:
 *         description: Internal server error.
 */

router.delete(
  "/delete/course/:id",
  authCheck,
  roleCheck("admin"),
  CourseManagementController.deleteCourse
);


// batch


/**
 * @swagger
 * /api/create/batch:
 *   post:
 *     tags:
 *       - Batch
 *     summary: Create a new Batch
 *     description: Create a new Batch
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - batchName
 *               - courseId
 *               - facultyId
 *               - startDate
 *               - endDate
 *               - status
 *             properties:
 *               batchName:
 *                 type: string
 *                 example: MERN Batch A
 *               courseId:
 *                 type: string
 *                 example: 687fd6b56f5d2d0012345678
 *               facultyId:
 *                 type: string
 *                 example: 687fd6b56f5d2d0012345679
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: "2026-09-01"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: "2027-03-01"
 *               status:
 *                 type: string
 *                 enum:
 *                   - active
 *                   - completed
 *                   - upcoming
 *                 example: active
 *     responses:
 *       201:
 *         description: Batch created successfully
 *       400:
 *         description: Bad Request - Missing or invalid fields
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal Server Error
 */

router.post(
  "/create/batch",
  authCheck,
  roleCheck("admin"),
  BatchManagementController.createBatch
);



/**
 * @swagger
 * /api/view/allbatch:
 *  get: 
 *    summary: Get all batch                                
 *    tags:
 *       - Batch
 *    security:
 *       - BearerAuth: []
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: data fetched successfully.
 *      500: 
 *        description: Server error
 */

router.get(
  "/view/allbatch",
  authCheck,
  roleCheck("admin"),
  BatchManagementController.viewAllBatch,
);



/**
 * @swagger
 * /api/edit/batch/{id}:
 *   get:
 *     tags:
 *       - Batch
 *     summary: View Batch
 *     description: Get a Batch by Batch ID. Only Admin can access this API.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Batch ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Batch fetched successfully.
 *       400:
 *         description: Invalid Batch ID.
 *       401:
 *         description: Unauthorized. Token is missing or invalid.
 *       403:
 *         description: Access denied. Admin only.
 *       404:
 *         description: Course not found.
 *       500:
 *         description: Internal server error.
 */

router.get(
  "/edit/batch/:id",
  authCheck,
  roleCheck("admin"),
  BatchManagementController.viewEditBatch
);


router.put(
  "/update/batch/:id",
  authCheck,
  roleCheck("admin"),
  BatchManagementController.updateBatch
);


/**
 * @swagger
 * /api/delete/batch/{id}:
 *   delete:
 *     tags:
 *       - Batch
 *     summary: Delete Batch
 *     description: Delete a batch by ID. Only Admin can access this API.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Batch ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Batch deleted successfully.
 *       400:
 *         description: Invalid Batch ID.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       403:
 *         description: Forbidden. Admin access only.
 *       404:
 *         description: Faculty not found.
 *       500:
 *         description: Internal server error.
 */

router.delete(
  "/delete/batch/:id",
  authCheck,
  roleCheck("admin"),
  BatchManagementController.deleteBatch,
);




// router.get(
//   "/view/add/batch/list",
//   authCheck,
//   roleCheck("admin"),
//   BatchManagementController.viewBatch,
// );


// payment management
// router.get(
//   "/view/payment/management",
//   authCheck,
//   roleCheck("admin"),
//   PaymentManagementController.viewPaymentPage,
// );


module.exports = router;
