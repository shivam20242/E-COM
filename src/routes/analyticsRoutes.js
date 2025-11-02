import express from 'express'
import { getAdminOverview, getUserTransactionHistory } from "../controllers/analyticsController.js";
import { adminAuth } from "../middlewares/adminAuth.js";
import protect from "../middlewares/authMiddleWare.js";


export const analyticsRoutes = express.Router();

analyticsRoutes.get("/user", protect, getUserTransactionHistory);

analyticsRoutes.get("/admin", adminAuth, getAdminOverview)
