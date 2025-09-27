import mongoose from "mongoose";

const {ObjectId} = mongoose.Schema;

const reviewSchema = mongoose.Schema({
    name:{type:String, required:true},
    rating:{type:Number, required:true},
    comment:{type:String, required:true},
    user:{type:ObjectId, ref:"User", required:true}
}, {timestamps: true});

const productSchema = mongoose.Schema({
    name:{ type: String, reqiured: true },
    image:{ type: String, required:true  },
    brand:{ type:String, required:true },
    stock: {type:Number, required: true },
    category:{type:String, required:true, enum:["men", "women", "kids", "accessories", "footwear"], default:"accessories"},
    description: { type: String, required: true },
    reviews: [reviewSchema],
    rating:{type:Number, default:0, required: true},
    numReviews:{type:Number, required:true, default:0},
    price:{type:Number, required:true, default:0}
},{timestamps: true});

export const Product = mongoose.model("Product", productSchema);