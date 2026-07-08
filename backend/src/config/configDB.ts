import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config();
const connectDb=async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL!);// this ! at the end tells ts that this value exists
        console.log("MONGO connected");
    } catch (error) {
        console.log(error);
    }
}
export  default connectDb;