import mongoose from "mongoose"
import {dbName} from "../constants.js"

const connectDB = async ()=>{
    try {
        const connInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${dbName}`);
        console.log(`Database connected !! -> DB Host: ${connInstance.connection.host}`);
        

    } catch (error) {
        console.log("MongoDB connection FAILED: ", error);
        process.exit(1)
    }
}

export default connectDB