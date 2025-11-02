import express from 'express'
import { authrouter } from './authRoutes.js';
import { productsRoutes } from './productroutes.js';
import { cartRoute } from './cartRoutes.js';
import { wishlistRouter } from './wishlistRoutes.js';
import { affiliateRouter } from './affiliateRoutes.js';
import { walletRoutes } from './walletRoutes.js';
import { withdrawalRoutes } from './withdrawalRoutes.js';
import { adminRoutes } from './adminRoutes.js';
import { analyticsRoutes } from './analyticsRoutes.js';

export const router = express.Router();

router.use("/auth", authrouter)

router.use("/products", productsRoutes )

router.use("/cart", cartRoute)

router.use("/wishlist", wishlistRouter)

router.use("/affiliate", affiliateRouter)

router.use("/wallet", walletRoutes)

router.use("/withdrawalRoutes", withdrawalRoutes)

router.use("/adminRoutes", adminRoutes)

router.use("/analytics", analyticsRoutes);