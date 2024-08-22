import mongoose from "mongoose";

export const connectDB = async ()=>{
    await mongoose.connect(process.env.MONGODB_URI, {
        dbName: "job_portal"
    })
    .then((connectionInstance)=>{
        console.log(`MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`)
    }).catch(err=>{
        console.log(`Some error occured while connecting to database: ${err}`)
    })
}

export default connectDB
