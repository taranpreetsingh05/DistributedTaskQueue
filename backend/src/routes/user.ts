import signUp from "../controller/auth/signUp.js";
import login from "../controller/auth/login.js"
import express from "express";
const router=express.Router();


router.post("/signup",signUp);
router.post("/login",login);

export default router;