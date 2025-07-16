import mongoose from "mongoose"

export const dbconnection = async()=>{
    try {
        await mongoose.connect(process.env.db_connection)
        console.log('connection successfull')
    } catch (error) {
        console.log(error)
    }
}