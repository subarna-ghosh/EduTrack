class StudentProfileController {
  viewStudentProfile(req, res) {
    return res.render("student/student_profile");
  }
}
module.exports = new StudentProfileController();
