import express from 'express';
import { filterTransactions, getUserWallet } from '../controllers/walletController.js';

export const walletRoutes = express.Router();

walletRoutes.get("/:userId", getUserWallet);
walletRoutes.get("/:userId/transactions", filterTransactions)