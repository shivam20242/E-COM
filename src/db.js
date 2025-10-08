import mongoose from 'mongoose'
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
const connectDB = async() =>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("✅ MongoDB Connected ")
    } catch (error) {
        console.log(`Error in MongoConnect ${error.message}`)
        process.exit(1)//Due to this My app OR server stop running due to DB not Connect
    }
}

export default connectDB