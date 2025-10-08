import express from 'express'
import { addReviewToProduct, createProduct, deleteProduct, getAllProducts, getCategoryStats, getProductById, getTopRatedProduct, updateProduct } from "../controllers/productControllers.js";

export const productsRoutes = express.Router();
//export const router = express.Router();

productsRoutes.post("/createProduct", createProduct);
productsRoutes.get("/getAllPRoducts", getAllProducts);
productsRoutes.get("/getSingleProduct/:id", getProductById);
productsRoutes.put("/updateSingleProduct/:id", updateProduct);
productsRoutes.delete("/deleteSingleProducts/:id", deleteProduct)

productsRoutes.post("/:id/reviews", addReviewToProduct)//add Review to Product;
productsRoutes.get("/analytics/top-rated", getTopRatedProduct)//Get Top Rated Product
productsRoutes.get("/analytics/category-stats", getCategoryStats)//Get Category Stats