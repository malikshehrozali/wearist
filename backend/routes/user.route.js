import { Router } from "express";
import { deleteUser, loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";

const router = Router();

router.post("/", registerUser);
router.post("/login", loginUser)
router.post("/logout", logoutUser)
router.route("/:id").delete(deleteUser)

export default router;