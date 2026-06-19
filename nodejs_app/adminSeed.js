const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const db = require("./app/config/db");
db();
const User = require("./app/models/User");
const Role = require("./app/models/Role");

async function seed() {
  let AdminRole = await Role.findOne({ roleName: "admin" });
  if (!AdminRole) {
    AdminRole = await Role.create({ roleName: "admin" });
  }

  let FacultyRole = await Role.findOne({ roleName: "faculty" });
  if (!FacultyRole) {
    FacultyRole = await Role.create({ roleName: "faculty" });
  }

  let StudentRole = await Role.findOne({ roleName: "student" });
  if (!StudentRole) {
    StudentRole = await Role.create({ roleName: "student" });
  }

  const isExist = await User.findOne({ email: "admin@gmail.com" });
  if (!isExist) {
    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash("Admin@123", salt);
    await User.create({
      name: "Admin",
      email: "admin@gmail.com",
      password: hashPass,
      roleId: AdminRole._id,
    });
  }

  console.log("seeding completed!");
}

seed();
