import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    student:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Student ID is required"],
    },
    supervisor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
})