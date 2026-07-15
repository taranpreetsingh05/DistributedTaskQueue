import express from "express";
import taskEmail from "../controller/email.js";
const router = express.Router();
router.post('/task',taskEmail);
export default router;