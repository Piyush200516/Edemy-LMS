import fs from "fs/promises";
import { v2 as cloudinary } from "cloudinary";
import Course from "../models/courseModel.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getAllCourses = asyncHandler(async (req, res, next) => {
    const courses = await Course.find({}).select("-lectures");

    res.status(200).json({
        success: true,
        message: "All courses",
        courses
    });
});

export const getCourseById = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const course = await Course.findById(id);

    if (!course) {
        return next(new AppError("Course not found", 404));
    }

    res.status(200).json({
        success: true,
        message: "Course details",
        lectures: course.lectures
    });
});

export const createCourse = asyncHandler(async (req, res, next) => {
    const { title, description, category, createdBy } = req.body;

    if (!title || !description || !category || !createdBy) {
        return next(new AppError("All fields are required", 400));
    }

    const course = await Course.create({
        title,
        description,
        category,
        createdBy,
        thumbnail: {
            public_id: "dummy",
            secure_url: "https://res.cloudinary.com/du9dxs6ac/image/upload/v1700000000/default_thumbnail.png"
        }
    });

    if (!course) {
        return next(new AppError("Course could not be created, please try again", 400));
    }

    if (req.file) {
        try {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "lms"
            });

            if (result) {
                course.thumbnail.public_id = result.public_id;
                course.thumbnail.secure_url = result.secure_url;

                await fs.rm(req.file.path);
            }
        } catch (e) {
            console.error(`Cloudinary Upload Error: ${e.message}`);
            try {
                await fs.rm(req.file.path);
            } catch (rmErr) {
                console.error(rmErr);
            }
        }
    }

    await course.save();

    res.status(201).json({
        success: true,
        message: "Course created successfully",
        course
    });
});

export const updateCourse = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const course = await Course.findByIdAndUpdate(
        id,
        { $set: req.body },
        { runValidators: true, new: true }
    );

    if (!course) {
        return next(new AppError("Course not found", 404));
    }

    res.status(200).json({
        success: true,
        message: "Course updated successfully",
        course
    });
});

export const deleteCourse = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const course = await Course.findById(id);

    if (!course) {
        return next(new AppError("Course not found", 404));
    }

    try {
        if (course.thumbnail.public_id && course.thumbnail.public_id !== "dummy") {
            await cloudinary.uploader.destroy(course.thumbnail.public_id);
        }
    } catch (e) {
        console.error(e);
    }

    await Course.findByIdAndDelete(id);

    res.status(200).json({
        success: true,
        message: "Course deleted successfully"
    });
});

export const addLecture = asyncHandler(async (req, res, next) => {
    const { title, description } = req.body;
    const { id } = req.params;

    if (!title || !description) {
        return next(new AppError("Lecture title and description are required", 400));
    }

    const course = await Course.findById(id);

    if (!course) {
        return next(new AppError("Course not found", 404));
    }

    const lectureData = {
        title,
        description,
        lecture: {
            public_id: "dummy_video",
            secure_url: "https://res.cloudinary.com/du9dxs6ac/video/upload/v1700000000/default_video.mp4"
        }
    };

    if (req.file) {
        try {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "lms",
                resource_type: "video"
            });

            if (result) {
                lectureData.lecture.public_id = result.public_id;
                lectureData.lecture.secure_url = result.secure_url;

                await fs.rm(req.file.path);
            }
        } catch (e) {
            console.error(`Cloudinary Video Upload Error: ${e.message}`);
            try {
                await fs.rm(req.file.path);
            } catch (rmErr) {
                console.error(rmErr);
            }
        }
    }

    course.lectures.push(lectureData);
    course.numberOfLectures = course.lectures.length;

    await course.save();

    res.status(200).json({
        success: true,
        message: "Lecture added successfully",
        course
    });
});

export const deleteLecture = asyncHandler(async (req, res, next) => {
    const { courseId, lectureId } = req.query;

    if (!courseId || !lectureId) {
        return next(new AppError("Course ID and Lecture ID are required", 400));
    }

    const course = await Course.findById(courseId);

    if (!course) {
        return next(new AppError("Course not found", 404));
    }

    const lectureIndex = course.lectures.findIndex(
        (lecture) => lecture._id.toString() === lectureId.toString()
    );

    if (lectureIndex === -1) {
        return next(new AppError("Lecture not found", 404));
    }

    try {
        const publicId = course.lectures[lectureIndex].lecture.public_id;
        if (publicId && publicId !== "dummy_video") {
            await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
        }
    } catch (e) {
        console.error(e);
    }

    course.lectures.splice(lectureIndex, 1);
    course.numberOfLectures = course.lectures.length;

    await course.save();

    res.status(200).json({
        success: true,
        message: "Lecture deleted successfully"
    });
});
