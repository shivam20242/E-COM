import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateWebToken from "../utils/generateToken.js";


export const registerUser = async(req, res) =>{
    try {
        const {name, email, password, role} = req.body;
        
        const userExist = await User.findOne({email});
        if(userExist){
            return res.status(400).json({
                message:"User Already Exist"
            })
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({name, email, password: hashedPassword, role:role})
        res.status(201).json({
            message: "User Registered Successfully",
            user: {id: user._id, name: user.name, email: user.email, role: user.role},
        })
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

export const loginUser = async(req,res) =>{
    try {
        const { email, password} = req.body
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                message:"Invalid Credentials"
            })
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({
                message:"Invalid Credentials"
            })
        }

        const token = generateWebToken(user._id, user.role);

        res.status(200).json({
            message:"Login Successfull",
            token,
            user:{id: user.id, name:user.name, email:user.email},
        })
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}