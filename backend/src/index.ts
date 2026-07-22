import dns from "dns";
// Fixes MongoDB Atlas SRV lookup issues on some networks
dns.setServers(["8.8.8.8", "8.8.4.4"]);
import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/configDB.js";
import userRoutes from "./routes/user.js"
import taskRoutes from "./routes/task.js"
import { serverAdapter } from "./config/bullboard.js";
import  "./config/redis.js";// this way we tell that we dont need any variable but we only want to establish connection so we do it this way
dotenv.config();
const app=express();
const PORT=process.env.PORT || 8000;
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.get('/',async(req,res)=>{
    return res.send("Backend is running");
})
app.use("/admin/queues", serverAdapter.getRouter());
app.use("/api/v1/user",userRoutes);
app.use("/api/v1/tasks",taskRoutes);
const startServer = async () => {
    try{await connectDb();

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });}
    catch(error){
        console.log(error);
    }
};

startServer();