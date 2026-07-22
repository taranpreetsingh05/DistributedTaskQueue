import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";
import {
    emailQueue,
    pdfQueue,
    imageQueue,
    notificationQueue,
} from "./bullmq.js";
const serverAdapter=new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");
createBullBoard({
    queues:[
        new BullMQAdapter(emailQueue),
        new BullMQAdapter(pdfQueue),
        new BullMQAdapter(imageQueue),
        new BullMQAdapter(notificationQueue),
    ],
    serverAdapter,
});
export {serverAdapter};