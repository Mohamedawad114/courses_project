import Booking from "./booking.model.js";
import category from "./categories.model.js";
import watchlist from "./courser_liked.model.js";
import course from "./courses.model.js";
import instructor from "./insructors.model.js";
import review from "./reviews_course.model.js";
import user from "./Students.model.js";

category.hasMany(course, { foreignKey: "categoryId" });
course.belongsTo(category, { foreignKey: "categoryId" });
///
user.belongsToMany(course, { foreignKey: "studentId", through: watchlist });
course.belongsToMany(user, { foreignKey: "courseId", through: watchlist });
///
instructor.belongsToMany(course, {
  through: "instructor_courses",
  foreignKey: "instructorId",
});
course.belongsToMany(instructor, {
  through: "instructor_courses",
  foreignKey: "courseId",
});

//
review.belongsTo(course, { foreignKey: "courseId" });
course.hasMany(review, { foreignKey: "courseId" });
//
review.belongsTo(user, { foreignKey: "studentId" });
user.hasMany(review, { foreignKey: "studentId" });
//
Booking.belongsTo(user, { foreignKey: "studentId" });
user.hasMany(Booking, { foreignKey: "studentId", onUpdate: "CASCADE" });
//
Booking.belongsTo(course, { foreignKey: "courseId" });
course.hasMany(Booking, { foreignKey: "courseId" });
///
Booking.belongsTo(instructor, { foreignKey: "instructorId" });
instructor.hasMany(Booking, { foreignKey: "instructorId" });
