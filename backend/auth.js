// import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const auth=(req,res,next)=>{
    const authHeader=req.header("Authorization");
    const token=authHeader && authHeader.split(" ")[1];
    if(!token) return res.status(401).json({isLoggedIn:false,message:"No Token"});
    try{
        const verified=jwt.verify(token,process.env.JWT_SECRET);
        req.user=verified;
        next();
    }catch(err){
        return res.status(403).json({ isLoggedIn: false, message: "Token invalid or expired" });
    }
};
export default auth;