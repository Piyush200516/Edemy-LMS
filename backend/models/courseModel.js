import { Schema, model } from "mongoose";

const courseSchema = new Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        minlength: [5, "Title must be at least 5 characters"],
        maxlength: [80, "Title must be less than 80 characters"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        minlength: [10, "Description must be at least 10 characters"]
    },
    category: {
        type: String,
        required: [true, "Category is required"]
    },
    createdBy: {
        type: String,
        required: [true, "Instructor name is required"]
    },
    thumbnail: {
        public_id: { type: String, required: true },
        secure_url: { type: String, required: true }
    },
    lectures: [
        {
            title: String,
            description: String,
            lecture: {
                public_id: { type: String, required: true },
                secure_url: { type: String, required: true }
            }
        }
    ],
    numberOfLectures: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

export const Course = model("Course", courseSchema);
export default Course;
