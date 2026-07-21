import express from "express";
import taskCreate from "../controller/task.js";
import auth from "../middleware/auth.js";
import { upload } from "../middleware/multer.js";
const router = express.Router();
router.post('/',upload.single("image"),auth,taskCreate);
export default router;