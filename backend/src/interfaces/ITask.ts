import { Types } from "mongoose";

export interface ITask {
    user: Types.ObjectId;
    type: "email" | "image" | "pdf" | "notification";
    payload: Record<string, unknown>;
    status: "pending" | "processing" | "failed" | "completed";
    priority: number;
    retryCount: number;
    maxRetries: number;
    scheduledAt: Date | null;
}