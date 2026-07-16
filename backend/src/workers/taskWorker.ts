import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);
import { Worker } from "bullmq";
import Task from "../schemas/task.js";
import sendEmail from "../services/email.js";
import generatePdf from "../services/pdf.js";
import sendNotifications from "../services/notification.js";
import processImage from "../services/image.js";
import dotenv from "dotenv";
import connectDb from "../config/configDB.js";
import "../config/redis.js";

dotenv.config();

await connectDb();//you need to connect worker also to the db

console.log("Task worker started");
const taskWorker=new Worker("taskQueue",async(job)=>{
    let task;// using this so that i dont have to do two queries in db to get the task id in try as well as catch
    try{
     task=await Task.findById(job.data.taskId);//here the worker reads whole payload from the mongo instead of from the redis
    if(!task){
        throw new Error("Task not found");

    }
    task.status="processing";
    await task.save();
    console.log(`task type:${task.type} started`)
    switch(task.type){
        case "email":await sendEmail(task.payload);
        break;
        default:throw new Error("unsupported task type");
    }
    task.status="completed";
    await task.save();}
    catch(error){
        if(task){
            task.status="failed";// we are doing this because in case the task is not completed then we have to update the status in the mongo db to failed
            await task.save();
        }
        throw error;// throw the original error 
    }
},{connection:{
    host:"127.0.0.1",
    port:6379

}});
taskWorker.on("completed", (job) => {
    console.log(`Job ${job.id} completed`);
});

taskWorker.on("failed", (job, err) => {
    console.log(`Job ${job?.id} failed`);
    console.log(err);
});