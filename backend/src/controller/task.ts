import { Request, Response } from "express";
import Task from "../schemas/task.js";

import { taskQueue } from "../config/bullmq.js";

async function taskCreate(req: Request, res: Response) {
  const { type, payload, priority,scheduledAt } = req.body;
  try {
    let delay = 0;
 let scheduledDate:Date|null=null;
if (scheduledAt) {
     scheduledDate = new Date(scheduledAt);

    if (isNaN(scheduledDate.getTime())) {
        return res.status(400).json({
            success: false,
            message: "Invalid scheduledAt date",
        });
    }

    delay = scheduledDate.getTime() - Date.now();

    if (delay < 0) {
        return res.status(400).json({
            success: false,
            message: "scheduledAt must be in the future",
        });
    }
}
    const task = await Task.create({
      user: req.user.id,
      type,
      payload,
      status: "pending",
      priority: priority ?? 1,
      retryCount: 0,
      maxRetries: 10,
      scheduledAt:scheduledDate
    });
    const job = await taskQueue.add(
      "send-email",
      {
        taskId: task._id.toString(),
      },
      {
        attempts: 3,        // the no. times it will try if something fails.
        delay,
        backoff:{           // w/o backoff the retries are immediate which is not ideal so we put a delay of 2s i.e. retry after 2s.
          type:"exponential",//note-this backoff is property of job but it works for worker for eg-redis adds job now worker tries to 
                             //complete the process but throws error now the retries start,the worker again tries.
          delay:2000
        }
      },
      
    );

    console.log("Job added:", job.id);

    res.status(201).json({
      success: true,
      task: task,
      message: " task created successfully",
    });
  } catch (error) {
    console.log(error);
  }
}
export default taskCreate;
