import { Router } from "express";
import {
    getRazorpayKey,
    subscribe,
    verifyPayment,
    cancelSubscription,
    getPaymentRecord
} from "../controllers/paymentController.js";
import { isLoggedIn, authorizeRoles } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/razorpay-key", isLoggedIn, getRazorpayKey);
router.post("/subscribe", isLoggedIn, subscribe);
router.post("/verify", isLoggedIn, verifyPayment);
router.post("/unsubscribe", isLoggedIn, cancelSubscription);
router.get("/", isLoggedIn, authorizeRoles("ADMIN"), getPaymentRecord);

export default router;
