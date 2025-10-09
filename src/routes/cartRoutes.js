import express from 'express';
import { addToCart, getCart, removeFromCart, updateCartItem } from '../controllers/cartController.js';

export const cartRoute = express.Router();

cartRoute.post("/add", addToCart);
cartRoute.get("/:userId", getCart);
cartRoute.delete("/remove", removeFromCart)
cartRoute.put("/update", updateCartItem)