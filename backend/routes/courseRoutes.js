import { Router } from "express";
import {
    getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    addLecture,
    deleteLecture
} from "../controllers/courseController.js";
import { isLoggedIn, authorizeRoles, authorizeSubscribers } from "../middleware/authMiddleware.js";
import upload from "../middleware/multerMiddleware.js";

const router = Router();

router
    .route("/")
    .get(getAllCourses)
    .post(isLoggedIn, authorizeRoles("ADMIN"), upload.single("thumbnail"), createCourse)
    .delete(isLoggedIn, authorizeRoles("ADMIN"), deleteLecture);

router
    .route("/:id")
    .get(isLoggedIn, authorizeSubscribers, getCourseById)
    .put(isLoggedIn, authorizeRoles("ADMIN"), updateCourse)
    .delete(isLoggedIn, authorizeRoles("ADMIN"), deleteCourse)
    .post(isLoggedIn, authorizeRoles("ADMIN"), upload.single("lecture"), addLecture);

export default router;
