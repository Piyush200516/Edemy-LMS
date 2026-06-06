import path from "path";
import multer from "multer";

const upload = multer({
    dest: "uploads/",
    limits: { fileSize: 50 * 1024 * 1024 }, // 50mb limit
    fileFilter: (_req, file, cb) => {
        let ext = path.extname(file.originalname).toLowerCase();
        if (
            ext !== ".jpg" &&
            ext !== ".jpeg" &&
            ext !== ".webp" &&
            ext !== ".png" &&
            ext !== ".mp4" &&
            ext !== ".mkv"
        ) {
            cb(new Error(`Unsupported file type! ${ext}`), false);
            return;
        }
        cb(null, true);
    }
});

export default upload;
