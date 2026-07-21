import { Request, Response } from "express";
import Task from "../schemas/task.js";

import {
    emailQueue,
    imageQueue,
    pdfQueue,
    notificationQueue,
} from "../config/bullmq.js";const taskPriorityMap = {
    email: 1,
    notification: 2,
    pdf: 3,
    image: 4,
} as const;
async function taskCreate(req: Request, res: Response) {
  const { type, payload,scheduledAt } = req.body;
  type TaskType = "email" | "notification" | "pdf" | "image";
  const priority:number=taskPriorityMap[type as TaskType];
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
let queue;

switch (type) {
    case "email":
        queue = emailQueue;
        break;

    case "image":
        queue = imageQueue;
        break;

    case "pdf":
        queue = pdfQueue;
        break;

    case "notification":
        queue = notificationQueue;
        break;

    default:
        return res.status(400).json({
            success: false,
            message: "Invalid task type",
        });
}
let parsedPayload = payload;

if (type === "image") {// Multer stores the uploaded image and provides its path in req.file.
// Sharp needs this path to locate and process the image,
// so we add imagePath to the payload before saving the task.
    parsedPayload = JSON.parse(payload);
    if (!req.file) {
    return res.status(400).json({
        success: false,
        message: "Image file is required",
    });
}

parsedPayload.imagePath = req.file.path;
}
    const task = await Task.create({
      user: req.user.id,
      type,
      payload:parsedPayload,
      status: "pending",
      priority,
      retryCount: 0,
      maxRetries: 10,
      scheduledAt:scheduledDate
    });
    const job = await queue.add(
      "task",
      {
        taskId: task._id.toString(),
      },
      {
        attempts: 3,        // the no. times it will try if something fails.
        delay,
        priority:task.priority,
        backoff:{           // w/o backoff the retries are immediate which is not ideal so we put a delay of 2s i.e. retry after 2s.
          type:"exponential",//note-this backoff is property of job but it works for worker for eg-redis adds job, now worker tries to 
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
