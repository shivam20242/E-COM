import express from 'express';
import { loginUser, registerUser } from '../controllers/authController.js';
import protect from '../middlewares/authMiddleWare.js';


export const authrouter = express.Router();

authrouter.use("/register", registerUser)

authrouter.use("/loginUser", loginUser);

//Protected Route

authrouter.get("/profile", protect, (req, res)=>{
    res.json({
        message:"Welcome to your Profile",
        User:req.user
    })
})