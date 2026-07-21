import { Queue } from "bullmq";
export const emailQueue = new Queue("emailQueue", {
    connection: {
    host: "127.0.0.1",
    port: 6379,
},
});
export const pdfQueue = new Queue("pdfQueue", {
    connection: {
    host: "127.0.0.1",
    port: 6379,
},
});
export const imageQueue = new Queue("imageQueue", {
    connection: {
    host: "127.0.0.1",
    port: 6379,
},
});
export const notificationQueue = new Queue("notificationQueue", {
    connection: {
    host: "127.0.0.1",
    port: 6379,
},
});