import express from "express";
import authController from "../Controllers/authController";


const router = express.Router();

router.post("/signUp", authController.signUp);
router.post("/login", authController.login);

export default router;