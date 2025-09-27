import jwt from "jsonwebtoken"
import asyncHandler from "./async.middelware.js"
import { User } from "../models/user.model.js";

const authenticate = asyncHandler(async(req, res, next)=>{
    let token;
    token = req.cookies.token
    if(token){
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            req.user = await User.findById(decoded.id).select("-password");
            next();
        } catch (error) {
            res.status(401);
            throw new Error("Not Authorized, token failed");
        }
    }else{
        res.status(401);
        throw new Error("Not authorized, token not found");
    }
});

const authenticateAdmin = asyncHandler(async(req, res, next)=>{
    if(req.user && req.user.isAdmin){
        next();
    }else{
        res.status(401);
        throw new Error("Not authorized as admin");
    }
});

export {authenticate, authenticateAdmin};