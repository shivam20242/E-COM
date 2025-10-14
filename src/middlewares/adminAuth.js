import User from "../models/User";
import jwt from '../models/userModel.js'

export const adminAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if(!token){
            return res.status(401).json({ success: false, message:"No token provided"})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if(!user || user.role !== "admin") {
            return res.status(403).json({success: false, message: "Access denied"})
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({ success: false, message:`Auth error: ${error.message}`})
    }
}