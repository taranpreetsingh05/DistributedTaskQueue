import { Request, Response } from "express";
import Task from "../schemas/task.js";

import { taskQueue } from "../config/bullmq.js";

async function taskCreate(req: Request, res: Response) {
  const { type, payload, priority } = req.body;
  try {
    const task = await Task.create({
      user: req.user.id,
      type,
      payload,
      status: "pending",
      priority: priority ? priority : 1,
      retryCount: 0,
      maxRetries: 10,
    });
    const job = await taskQueue.add(
      "send-email",
      {
        taskId: task._id.toString(),
      },
      {
        attempts: 3,
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
