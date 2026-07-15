import { Request,Response,NextFunction } from "express";
import jwt from "jsonwebtoken";
interface JwtPayload {
    id: string;
    role: "user" | "admin";
}

async function auth(req:Request,res:Response,next:NextFunction){//using auth headers
    const authHeader = req.headers.authorization;//check for auth header in the req
    if (!authHeader) {
    res.status(401).json({
        success: false,
        message: "Authorization header missing",
    });
    return;
}
if (!authHeader.startsWith("Bearer ")) {//should start with Bearer as it is the fromat Bearer abc.xyz..
    res.status(401).json({
        success: false,
        message: "Invalid authorization format",
    });
    return;
}
const token = authHeader.split(" ")[1];//get the token which is after the Bearer that is why we split
try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!)as JwtPayload;
    req.user = {
    id: decoded.id,
    role: decoded.role
};
next();
} catch (error) {
    res.status(401).json({
        success: false,
        message: "Invalid or expired token",
    });
    return;
}
}
export default auth;