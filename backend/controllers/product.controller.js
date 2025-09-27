import asyncHandler from "../middlewares/async.middelware.js";
import { Product } from "../models/product.model.js";
import deleteFromCloudinary from "../utils/deleteFromCloudinary.js";
import uploadOnCloudinary from "../utils/uploadOnCloudinary.js";

const createProduct = asyncHandler(async(req, res)=>{
    const {name, price, description, category, brand, stock} = req.body;
    if(!name || !price || !description || !category || !brand || !stock){
        res.status(400);
        throw new Error("Please fill all the required fields");
    }
    if(!req.files || !req.files.image){
       return res.status(400).json({message:"Image is required"});
    }
    const productImagePath = req.files.image[0]?.path;
    console.log(productImagePath);  
    const image = await uploadOnCloudinary(productImagePath);
    if(!image){
        res.status(503);
        throw new Error("Image is required to be uploaded on cloudinary");
    };
    const product = new Product({
        name,
        price,
        description,
        image: image?.url || "",
        category,
        brand,
        stock
    });
    await product.save();
    res.status(201).json(product);
});

const updateProduct = asyncHandler(async(req,res)=>{
    try {
    const { id } = req.params;
    const { name, price, description, category, brand, stock } = req.body;

    // Find the product first
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // If image is provided
    if (req.files && req.files.image) {
      const productImagePath = req.files.image[0]?.path;

      // Delete old image from Cloudinary
      if (product.image) {
        const publicId = product.image.split("/").pop().split(".")[0]; 
        await deleteFromCloudinary(publicId);
      }

      // Upload new image
      const newImage = await uploadOnCloudinary(productImagePath);
      if (!newImage) {
        return res.status(503).json({ message: "Failed to upload image" });
      }
      product.image = newImage.url;
    }

    // Update other fields if provided
    if (name) product.name = name;
    if (price) product.price = price;
    if (description) product.description = description;
    if (category) product.category = category;
    if (brand) product.brand = brand;
    if (stock) product.stock = stock;

    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

const removeProduct = asyncHandler(async(req,res)=>{
    try {
        const {id}= req.params;
        const product = await Product.findById(id);
        if(!product){
            res.status(404);
            throw new Error("Product not found");
        }
        if(product.image){
            const publicId = product.image.split("/").pop().split(".")[0];
            await deleteFromCloudinary(publicId);
        }
        await product.deleteOne();
        res.status(200).json({message: "Product deleted successfully", product});
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Server Error"})
    }
});

const fetchProductByKeyword = asyncHandler(async(req,res)=>{
    try {
    const { name, category, brand, minPrice, maxPrice } = req.query;

    // url's to follow
    // http://localhost:5000/api/products/search?name=shirt || GET http://localhost:5000/api/products/search?category=shoes&brand=nike || http://localhost:5000/api/products/search?category=shoes&brand=nike || http://localhost:5000/api/products/search?minPrice=100&maxPrice=500 || http://localhost:5000/api/products/search?name=jeans&category=men&minPrice=50&maxPrice=200

    // Build a query object
    let query = {};

    if (name) {
      query.name = { $regex: name, $options: "i" }; // case-insensitive search
    }

    if (category) {
      query.category = { $regex: category, $options: "i" };
    }

    if (brand) {
      query.brand = { $regex: brand, $options: "i" };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Find products matching the query
    const products = await Product.find(query).sort({ createdAt: -1 });

    res.status(200).json(products);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Server Error"});
    }
});

const fetchProductById = asyncHandler(async(req,res)=>{
    try {
        const product = await Product.findById(req.params.id);
        if(product){
            res.status(200).json(product);
        }else{
            res.status(404).json({message: "Product not found"});
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({message: "Server Error"})
    }
});

const fetchAllProducts = asyncHandler(async(req,res)=>{
    try {
        const products = await Product.find().populate("category").limit(12).sort({ createAt: -1 });
        res.status(200).json(products);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Server Error"});
    }
});

const addProductReviews = asyncHandler(async(req,res)=>{
    try {     
        const {rating, comment} = req.body;
        const product = await Product.findById(req.params.id);
        if(product){
            const alreadyRated = product.reviews.find(r => r.user.toString() === req.user._id.toString());
            if(alreadyRated){
                res.status(400);
                throw new Error("Product already reviewed");
            }
            const review = {
                name: req.user.fullName,
                rating: Number(rating),
                comment,
                user:req.user._id
            }
    
            product.reviews.push(review);
            product.numReviews = product.reviews.length;
            product.rating = product.reviews.reduce((acc, item)=> item.rating + acc, 0) / product.reviews.length;
    
            await product.save();
            res.status(200).json({message: "Reviews Added Successfully"});
        }else{
            res.status(404);
            throw new Error("Product not found");
        }
    } catch (error) {
        console.log(error);
        res.status(404).json({error: "Server Error"})
    }
});

const getTopProducts = asyncHandler(async(req,res)=>{
    try{
        const products = await Product.find({}).sort({ rating: -1 }).limit(4);
        res.status(200).json(products);
    }catch (error) {
        console.error(error);
        res.status(400).json(error.message);
    }
});

const getNewProducts = asyncHandler(async(req,res)=>{
     try{
        const products = await Product.find({}).sort({ createdAt: -1 }).limit(10);
        res.status(200).json(products);
    }catch (error) {
        console.error(error);
        res.status(400).json(error.message);
    }
});


export {createProduct, updateProduct, removeProduct, fetchProductByKeyword, fetchProductById, fetchAllProducts, addProductReviews, getTopProducts, getNewProducts};