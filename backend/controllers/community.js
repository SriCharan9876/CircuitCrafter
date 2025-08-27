import Post from "../models/community.js";
import BaseModel from '../models/baseModel.js';

export const getPosts=async(req,res)=>{
    try{
        const posts = await Post.find({}).populate("author");
        return res.json({fetched:true,posts})
    }catch(err){
        console.log(err);
        return res.json({fetched:false,message:"Failed to fetch Posts"});
    }
}
export const getPostsMen=async(req,res)=>{
    try{
        const posts = await Post.find({}).populate("author");
        const puser=req.user?.userId;
        const models= await BaseModel.find({createdBy:puser});
        return res.json({fetched:true,posts,models});
    }catch(err){
        console.log(err);
        return res.json({fetched:false,message:"Failed to fetch Posts"});
    }
}
export const getPost=async(req,res)=>{
    try{
        const {id}=req.params;
        const posts = await Post.findOne({_id:id}).populate("author").populate("comments.user");
        return res.json({fetched:true,posts});
    }catch(err){
        console.log(err);
        return res.json({fetched:false,message:"Failed to fetch Posts"});
    }
}
export const getPostlogged=async(req,res)=>{
    try{
        const {id}=req.params;
        const puser=req.user?.userId;
        console.log("checking:",puser)
        const posts = await Post.findOne({_id:id}).populate("author").populate("comments.user");
        if(puser&&(!posts.views.includes(puser) || posts.views==[])){
          posts.views.push(puser);
          await posts.save();
        }
        return res.json({fetched:true,posts});
    }catch(err){
        console.log(err);
        return res.json({fetched:false,message:"Failed to fetch Posts"});
    }
}
export const createPost = async (req, res) => {
  try {
    const { title, content, topics, people, posts, models } = req.body;

    const post = new Post({
      title,
      content,
      topics,
      posts: posts?.map(p=> p.title),
      models: models?.map(p=>p.modelName),
      people: people?.map(p => p.name), // ✅ only store names
      author: req.user.userId,
    });

    await post.save();
    return res.json({ posted: true, message: "Successfully posted" });
  } catch (error) {
    console.log(error);
    return res.json({ posted: false, message: "Failed to create post" });
  }
};


export const likeToggle=async(req,res)=>{
    try{
        const {id}=req.params;
        const puser=req.user.userId;
        const post=await Post.findOne({_id:id});
        if(post.likes.indexOf(puser)==-1){
            post.likes.push(req.user.userId);
        }else{
            post.likes.splice(post.likes.indexOf(puser),1)
        }
        await post.save();
        return res.json({liked:true,message:"Successfully liked/unliked"});
    }catch(err){
        console.log(err)
        return res.json({ liked:false,message: "Failed to like/unlike Post" });
    }
}
export const addComment = async (req, res) => {
  try {
    const { id } = req.params; // Post ID
    const { comment } = req.body;
    const userId = req.user.userId;

    if (!comment || comment.trim() === "") {
      return res.json({ success: false, message: "Comment cannot be empty." });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.json({ success: false, message: "Post not found." });
    }

    const newComment = {
      user: userId,
      text: comment.trim(),
      createdAt: new Date()
    };

    post.comments.unshift(newComment); // add newest at the top
    await post.save();

    return res.json({ success: true, message: "Comment added successfully." });
  } catch (err) {
    console.error(err);
    return res.json({ success: false, message: "Failed to add comment." });
  }
};

export const postExist=async(req,res)=>{
  try{
    const {value}=req.params;
    const post=await Post.findOne({title:value})
    if(post){
      return res.json({exist:true,post:post})
    }else{
      return res.json({exist:false})
    }
  }catch(err){
    console.log(err);
    return res.status(500).json({ error: "Server error" });
  }
}