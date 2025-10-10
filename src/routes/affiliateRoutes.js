import express from 'express'
import { confirmAffiliatePurchase, rejectAffiliatePurchase, tracksAffiliatePurchase } from '../controllers/affiliateController.js';

export const affiliateRouter = express.Router();

affiliateRouter.post("/track", tracksAffiliatePurchase);
affiliateRouter.put("/confirm/:purchaseId", confirmAffiliatePurchase);
affiliateRouter.put("/reject/:purchaseId", rejectAffiliatePurchase);