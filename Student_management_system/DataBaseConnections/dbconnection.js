import mongoose from "mongoose";

export const connectToDB = async() => {
    await mongoose.connect("mongodb://127.0.0.1:27017");
};