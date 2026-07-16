import express from "express";
import taskCreate from "../controller/task.js";
import auth from "../middleware/auth.js";
const router = express.Router();
router.post('/',auth,taskCreate);
export default router;