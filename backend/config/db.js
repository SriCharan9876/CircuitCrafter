import mongoose from 'mongoose';

async function main() {
    const dbUrl=process.env.ATLASDB_URL;
    await mongoose.connect(dbUrl);
}

const connectDB=()=>{

    return main()
        .then(()=>{
            console.log("Connected to DB");
        }).catch((err)=>{
            console.log("Mongoose connection error:");
            console.log(err);
        });
}

export default connectDB;