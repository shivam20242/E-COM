import express from 'express'
import { addToWishList, getWishlist, removeFromWishlist } from '../controllers/wishlistController.js';

export const wishlistRouter = express.Router();

wishlistRouter.post("/add", addToWishList );
wishlistRouter.get("/:userId", getWishlist);
wishlistRouter.delete("/remove", removeFromWishlist)