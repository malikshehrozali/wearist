import { Router } from "express";
import { addProductReviews, createProduct, fetchAllProducts, fetchProductById, fetchProductByKeyword, getNewProducts, getTopProducts, removeProduct, updateProduct } from "../controllers/product.controller.js";
import { authenticate, authenticateAdmin } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";
import checkId from "../middlewares/checkId.middleware.js";

const router = Router();

router.post("/", upload.fields([{ name: "image", maxCount: 1 }]), authenticate, authenticateAdmin, createProduct).get("/", fetchAllProducts);
router.get("/search", fetchProductByKeyword);
router.get("/top", getTopProducts);
router.get("/new", getNewProducts);
router.post("/:id/reviews", checkId, authenticate, addProductReviews);
router.post("/:id", authenticate, authenticateAdmin, upload.fields([{ name: "image", maxCount: 1 }]), updateProduct).delete("/:id", authenticate, authenticateAdmin, removeProduct).get("/:id",fetchProductById);



export default router