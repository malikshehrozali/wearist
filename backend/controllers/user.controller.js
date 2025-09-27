import asyncHandler from "../middlewares/async.middelware.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

const registerUser = asyncHandler(async (req,res)=>{
    const {fullName, email, password, phone} = req.body; 
    if(!fullName || !email || !password){
        res.status(400);
        throw new Error("Please fill all the required fields");
    }
    const userExists = await User.findOne({email});
    if(userExists){
        res.status(400).json({message: "user already exists"});
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({
        fullName,
        email,
        password: hashedPassword,
        phone,
        isAdmin: email === "malikshehrozali16@gmail.com" ? true : false
    });
    try {
        await user.save()
        generateToken(user._id, res)
        res.status(201).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
            isAdmin: user.isAdmin,
        })
    } catch (error) {
        console.log(error);
        
    }
    
    
});

const loginUser = asyncHandler(async (req, res)=>{
    try {
        const {email, password} = req.body;
        if(!email || !password){
            res.status(400);
            throw new Error("Please fill all the required fields");
        }
        const user = await User.findOne({email});
        console.log(user);
        
        if(user){
            const isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch){
                res.status(400);
                throw new Error("Invalid credentials");
            }
            generateToken(res, user._id)
            res.status(200).json({
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                isAdmin: user.isAdmin,
            });
        }
    } catch (error) {
        console.log(error);
        
    }
});

const logoutUser = asyncHandler(async (req,res)=>{
    res.cookie("token"," ", {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({message: "Logged out successfully"});
});

const deleteUser = asyncHandler(async(req,res)=>{
    const {id}= req.params;
    try {
        const user = await User.findByIdAndDelete(id);
        if(!user){
            return res.status(404).json({message:"User not found"});
        }else{
            return res.status(200).json({
                message:"User deleted successfully",
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Server Error"})
    }
})

export {registerUser, loginUser, logoutUser, deleteUser};