import express from 'express'
import { handleWithdrawal, requestWithdrawal } from '../controllers/withdrawalController.js';
export const withdrawalRoutes = express.Router();

withdrawalRoutes.post("/", requestWithdrawal);
withdrawalRoutes.put("/:withdrawalId", handleWithdrawal);