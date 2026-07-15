import mongoose from "mongoose";

 interface IUser{
    name:string,
    email:string,
    password:string,
    role:'user'|'admin',
    phoneNumber:string
}
const userSchema=new mongoose.Schema<IUser>({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true

    },
    password:{
        type:String,
        required:true,
        trim:true

    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    },
    phoneNumber:{
        type:String,
        trim:true
    }

},{
    timestamps:true
});
const User=mongoose.model<IUser>("User",userSchema);
export default User;