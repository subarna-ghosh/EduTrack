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
 * /adminapi/view/admindashboard:
 *  get:
 *    summary: Get admin dashboard
 *    tags:
 *       - Admin
 *    security:
 *       - bearerAuth: []
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: data fetched successfully.
 *      500: 
 *        description: Server error
 */

router.get("/view/admindashboard",
  authCheck,
  roleCheck("admin"),
  AdminController.viewAdminDashboard
);


// department

/**
 * @swagger
 * /adminapi/create/department:
 *   post:
 *     summary: Create a new department
 *     tags:
 *       - Department
 *     security:
 *       - bearerAuth: []
 *     produces: 
 *       - application/json
 *     parameters: 
 *       - in: body
 *         name: Add Category
 *         description: Create Category
 *         schema: 
 *           type: object
 *           required: 
 *             - deptName    
 *           properties: 
 *             deptName: 
 *               type: string            
 *     responses:
 *       201:
 *         description: Department created successfully
 *       400:
 *         description: Bad Request - Missing fields
 *       500:
 *         description: Server error
 */

router.post("/create/department",
  authCheck,
  roleCheck("admin"),
  validateApi(departmentSchema),
  FacultyManagementController.createDepartment
);



// faculty

/**
 * @swagger
 * /adminapi/create/faculty:
 *   post:
 *     tags:
 *       - Faculty
 *     security:
 *       - bearerAuth: []
 *     summary: Create Faculty
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
 *         name: deptId
 *         type: string
 *         required: true
 *         description: Department ID (MongoDB ObjectId)
 *       - in: formData
 *         name: experience
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
 *         description: Faculty Profile Image
 *     responses:
 *       201:
 *         description: Faculty created successfully
 *       400:
 *         description: Bad Request - Missing fields
 *       500:
 *         description: Server error
 */

router.post( "/create/faculty", 
    authCheck, 
    roleCheck("admin"), 
    validateApi(facultySchema),
    uploadProfileImage.single("profileImage"),
    FacultyManagementController.createFaculty
);

/**
 * @swagger
 * /adminapi/view/allfaculty:
 *  get: 
 *    summary: Get all faculty                                            
 *    tags:
 *       - Admin
 *    security:
 *       - bearerAuth: []
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
 * /adminapi/view/faculty/{id}:
 *   get:
 *     tags:
 *       - Faculty
 *     summary: View Faculty Profile
 *     description: Get a faculty profile by Faculty ID. Only Admin can access this API.
 *     security:
 *       - bearerAuth: []
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
  "/view/faculty/:id",
  authCheck,
  roleCheck("admin"),
  FacultyManagementController.facultyProfile
);


/**
 * @swagger
 * /adminapi/view/faculty/{id}:
 *   get:
 *     tags:
 *       - Faculty
 *     summary: View Faculty Profile
 *     description: Get a faculty profile by Faculty ID. Only Admin can access this API.
 *     security:
 *       - bearerAuth: []
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
  "/edit/faculty/:id",
  authCheck,
  roleCheck("admin"),
  FacultyManagementController.editFacultyView,
);


/**
 * @swagger
 * /adminapi/update/faculty/{id}:
 *   put:
 *     tags:
 *       - Faculty
 *     summary: Update Faculty
 *     description: Update faculty details including profile image. Only Admin can access this API.
 *     consumes:
 *       - multipart/form-data
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Faculty ID
 *         schema:
 *           type: string
 *       - in: formData
 *         name: name
 *         type: string
 *         required: false
 *       - in: formData
 *         name: email
 *         type: string
 *         required: false
 *       - in: formData
 *         name: phone
 *         type: string
 *         required: false
 *       - in: formData
 *         name: department
 *         type: string
 *         required: false
 *       - in: formData
 *         name: designation
 *         type: string
 *         required: false
 *       - in: formData
 *         name: profileImage
 *         type: file
 *         required: false
 *         description: Upload faculty profile image
 *     responses:
 *       200:
 *         description: Faculty updated successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       403:
 *         description: Forbidden. Admin access only.
 *       404:
 *         description: Faculty not found.
 *       500:
 *         description: Internal server error.
 */

router.put(
  "/update/faculty/:id",
  authCheck,
  roleCheck("admin"),
  uploadProfileImage.single("profileImage"),
  FacultyManagementController.updateFaculty,
);


/**
 * @swagger
 * /adminapi/delete/faculty/{id}:
 *   delete:
 *     tags:
 *       - Faculty
 *     summary: Delete Faculty
 *     description: Delete a faculty by ID. Only Admin can access this API.
 *     security:
 *       - bearerAuth: []
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
 * /adminapi/create/student:
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
 * /adminapi/view/allstudent:
 *  get: 
 *    summary: Get all student                                          
 *    tags:
 *       - Student
 *    security:
 *       - bearerAuth: []
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
 * /adminapi/view/student/{id}:
 *   get:
 *     tags:
 *       - Student
 *     summary: View student Profile
 *     description: Get a student profile by Student ID. Only Admin can access this API.
 *     security:
 *       - bearerAuth: []
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
 * /adminapi/edit/student/{id}:
 *   get:
 *     tags:
 *       - Student
 *     summary: View Student Profile
 *     description: Get a student profile by Student ID. Only Admin can access this API.
 *     security:
 *       - bearerAuth: []
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
 * /adminapi/delete/student/{id}:
 *   delete:
 *     tags:
 *       - Student
 *     summary: Delete Student
 *     description: Delete a Student by ID. Only Admin can access this API.
 *     security:
 *       - bearerAuth: []
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
 * /adminapi/create/course:
 *   post:
 *     tags:
 *       - Course
 *     summary: Create a new course
 *     description: Create a new course
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Course details
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - courseName
 *             - duration
 *             - fees
 *             - description
 *             - status
 *           properties:
 *             courseName:
 *               type: string
 *               example: BCA
 *             duration:
 *               type: string
 *               example: 3 Years
 *             fees:
 *               type: number
 *               example: 50000
 *             description:
 *               type: string
 *               example: Bachelor of Computer Applications
 *             status:
 *               type: boolean
 *               example: true
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

router.post("/create/course",
  authCheck,
  roleCheck("admin"),
  validateApi(courseSchema),
  CourseManagementController.createCourse,
);



/**
 * @swagger
 * /adminapi/view/allcourse:
 *  get: 
 *    summary: Get all course                                    
 *    tags:
 *       - Course
 *    security:
 *       - bearerAuth: []
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: data fetched successfully.
 *      500: 
 *        description: Server error
 */

router.get("/view/allcourse",
  authCheck,
  roleCheck("admin"),
  CourseManagementController.viewAllCourse,
);



/**
 * @swagger
 * /adminapi/edit/course/{id}:
 *   get:
 *     tags:
 *       - Course
 *     summary: View Course Profile
 *     description: Get a Course by Course ID. Only Admin can access this API.
 *     security:
 *       - bearerAuth: []
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
  CourseManagementController.viewCourseEdit,
);


router.put(
  "/update/course/:id",
  authCheck,
  roleCheck("admin"),
  CourseManagementController.courseUpdate
);



/**
 * @swagger
 * /adminapi/delete/course/{id}:
 *   delete:
 *     tags:
 *       - Course
 *     summary: Delete Course
 *     description: Delete a Course by ID. Only Admin can access this API.
 *     security:
 *       - bearerAuth: []
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
 * /adminapi/create/batch:
 *   post:
 *     tags:
 *       - Batch
 *     summary: Create a new Batch
 *     description: Create a new Batch
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Batch details
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - batchName
 *             - courseId
 *             - facultyId
 *             - startDate
 *             - endDate
 *             - status
 *           properties:
 *             batchName:
 *               type: string
 *               example: BCA Morning Batch
 *             courseId:
 *               type: string
 *               example: 6864d5e6f8a9b12345678901
 *             facultyId:
 *               type: string
 *               example: 6864d60af8a9b12345678902
 *             startDate:
 *               type: string
 *               format: date
 *               example: "2026-07-01"
 *             endDate:
 *               type: string
 *               format: date
 *               example: "2029-06-30"
 *             status:
 *               type: boolean
 *               example: true
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
 * /adminapi/view/allbatch:
 *  get: 
 *    summary: Get all batch                                
 *    tags:
 *       - Batch
 *    security:
 *       - bearerAuth: []
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
 * /adminapi/edit/batch/{id}:
 *   get:
 *     tags:
 *       - Batch
 *     summary: View Batch
 *     description: Get a Batch by Batch ID. Only Admin can access this API.
 *     security:
 *       - bearerAuth: []
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
 * /adminapi/delete/batch/{id}:
 *   delete:
 *     tags:
 *       - Batch
 *     summary: Delete Batch
 *     description: Delete a batch by ID. Only Admin can access this API.
 *     security:
 *       - bearerAuth: []
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
