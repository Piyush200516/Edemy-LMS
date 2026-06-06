import { Schema, model } from "mongoose";

const contactSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        lowercase: true
    },
    message: {
        type: String,
        required: [true, "Message is required"]
    }
}, { timestamps: true });

export const Contact = model("Contact", contactSchema);
export default Contact;
