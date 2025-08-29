import { Server } from "socket.io";
const Messaging=(server)=>{
    const io=new Server(server,{
        cors:{
            origin:"https://circuit-crafter.vercel.app",
            methods:["GET","POST"],
            allowedHeaders:["*"],
            credentials:true
        }
    });
    io.use((socket,next)=>{
        const userId=socket.handshake.auth.userId;
        console.log(userId);
        if(!userId) return next(new Error('Unauthorized'));
        socket.userId=userId;
        next();
    });
    const onlineUsers=new Map();
    io.on("connection",(socket)=>{
        onlineUsers.set(socket.userId,socket.id);
        socket.on("join-public-room",({roomId})=>{
            console.log("joined")
            socket.join(roomId);
        })
        socket.on("public-message",async({username,newMsg,id})=>{
            console.log(`New message from ${username}: ${newMsg} to room ${id}`);
            io.to(id).emit('public-message',{
                username,newMsg,id
            })
        }) 
        socket.on("private-message",async({username,newMsg,id,receiverId})=>{
            console.log(`New message from ${username}: ${newMsg} to room ${receiverId}`);
            io.to(id).emit('private-message',{
                username,newMsg,id,receiverId
            })
        })
    });
    return io;
}
export default Messaging;