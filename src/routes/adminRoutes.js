import express from 'express'
import { adminAuth } from '../middlewares/adminAuth.js';
import { approveAffiliatePurchase, getAdminDashboard, handleWithdrawalRequest } from '../controllers/adminController.js';

export const adminRoutes = express.Router();

adminRoutes.get("/dashboard", adminAuth, getAdminDashboard);

adminRoutes.put("/affialiate", adminAuth, approveAffiliatePurchase)

adminRoutes.put("/withdrawal", adminAuth, handleWithdrawalRequest)
