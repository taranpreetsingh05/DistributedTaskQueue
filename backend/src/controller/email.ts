import {Request,Response} from "express";
import Task from "../schemas/task.js";

import { emailQueue } from "../config/bullmq.js";

async function taskEmail(req:Request,res:Response):Promise<void>{
    try {
        const task=await Task.create({
            user:req.user.id,
            type:"email",
            payload:req.body,
            status:"pending",
            priority:1,
            retryCount:0,
            maxRetries:10
        });
            await emailQueue.add("send-email",{//we dont need to send everything in payload since evrything is already stored in mongo
                taskId:task._id.toString()
            },{
                attempts:3
            })
        
         res.status(201).json({
            success:true,
            task:task,
            message:"email task created successfully"
        })

    } catch (error) {
        console.log(error);
    }
}
export default taskEmail;