import { transporter } from "../config/mail.js";
import { Types } from "mongoose";
import { ITask } from "../interfaces/ITask.js";
async function sendEmail(task: ITask) {
    try {
        const payload = task.payload as {
            to: string;
            subject: string;
            text: string;
        };

        console.log(payload);

        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: payload.to,
            subject: payload.subject,
            text: payload.text,
        });

        console.log("Email sent:", info.messageId);
    } catch (err) {
        console.error(err);
    }
}
export default sendEmail;