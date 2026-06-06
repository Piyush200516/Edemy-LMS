import { Router } from "express";
import { getStats, getAllUsers } from "../controllers/adminController.js";
import { isLoggedIn, authorizeRoles } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/stats/users", isLoggedIn, authorizeRoles("ADMIN"), getStats);
router.get("/users", isLoggedIn, authorizeRoles("ADMIN"), getAllUsers);

export default router;
