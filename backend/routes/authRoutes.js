import { Router } from "express";
import {
    register,
    login,
    logout,
    getProfile,
    updateProfile,
    changePassword
} from "../controllers/authController.js";
import { isLoggedIn } from "../middleware/authMiddleware.js";
import upload from "../middleware/multerMiddleware.js";

const router = Router();

router.post("/register", upload.single("avatar"), register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", isLoggedIn, getProfile);
router.put("/update/:id", isLoggedIn, upload.single("avatar"), updateProfile);
router.post("/change-password", isLoggedIn, changePassword);

export default router;
