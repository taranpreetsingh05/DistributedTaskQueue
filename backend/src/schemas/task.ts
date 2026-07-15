import mongoose, { Schema, Types } from "mongoose";
interface ITask {
  user: Types.ObjectId;
  type: "email" | "image" | "pdf" | "notification";
  payload: Record<string, unknown>;
  status: "pending" | "processing" | "failed" | "completed";
  priority: number;
  retryCount: number;
  maxRetries: number;
}

const taskSchema = new mongoose.Schema<ITask>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["email", "image", "pdf", "notification"],
    required: true,
  },
  payload: {
    type: Schema.Types.Mixed,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "processing", "completed", "failed"],
    default: "pending",
  },
  priority:{
    type: Number,
    default:0
  },
  retryCount: {
    type: Number,
    default: 0,
  },
  maxRetries:{
    type:Number,
    default:0
  }
},{timestamps:true});

const Task=mongoose.model<ITask>("Task",taskSchema);
export default Task;
