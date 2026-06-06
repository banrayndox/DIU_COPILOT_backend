import mongoose from "mongoose";

const connectDB = async () =>{
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('connected to mongodb successfully');
        
    } catch (error) {
        console.error('mongodb connection failed', error.message)
    }
}
export default connectDB