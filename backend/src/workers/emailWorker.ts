import { Worker } from "bullmq";
import mongoose from "mongoose";
import Task from "../schemas/task.js";
const emailWorker=new Worker("emailQueue",async(job)=>{
    let task;// using this so that i dont have to do two queries in db to get the task id in try as well as catch
    try{
     task=await Task.findById(job.data.taskId);//here the worker reads whole payload from the mongo instead of from the redis
    if(!task){
        throw new Error("Task not found");

    }
    task.status="processing";
    await task.save();
    await new Promise((resolve)=>setTimeout(resolve,3000));
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
emailWorker.on("completed", (job) => {
    console.log(`Job ${job.id} completed`);
});

emailWorker.on("failed", (job, err) => {
    console.log(`Job ${job?.id} failed`);
    console.log(err);
});