import Post from "../models/community.js";
import User from "../models/user.js";
export const getPosts=async(req,res)=>{
    try{
        // const posts=await Post.find({});
        // const users=[];
        // for(let post of posts){
        //     const puser=post.author;
        //     console.log("user:",puser);
        //     const user=await User.find({_id:puser});
        //     users.push(user);
        // }
        const posts = await Post.find({}).populate("author");
        return res.json({fetched:true,posts});
    }catch(err){
        console.log(err);
        return res.json({fetched:false,message:"Failed to fetch Posts"});
    }
}

export const createPost=async(req,res)=>{
    try {
      const { title, content, topics } = req.body;
      const post = new Post({
        title,
        content,
        topics,
        author: req.user.userId
      });
    
      await post.save();
      return res.json({posted:true,message:"Successfully posted"});
    } catch (error) {
        console.log(error)
        return res.json({ posted:false,message: "Failed to create post" });
    }
}