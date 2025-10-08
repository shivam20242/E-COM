import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
dotenv.config({ path: '.../.env' });

const protect = async (req, res, next) => {
    let token;
    try {
        if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){

            //Extract token from 'Bearer <token>'
            token = req.headers.authorization.split(" ")[1];

            //verify Token
            const decoded =jwt.verify(token, process.env.JWT_SECRET);

            //Find User and attach to request
            req.user = await User.findById(decoded.id).select("-password");

            next(); //move to next middleware/controller
        }else{
            return res.status(401).json({
                message:"Not Authorized, no token"
            })
        }
    } catch (error) {
        console.log("JWT Error MiddleWare", error.message)
        return res.status(401).json({
            success:false,
            message:`Getting Error ${error.message}`
        })
    }
}

export default protect