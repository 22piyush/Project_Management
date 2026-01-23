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
        default: null,
    },
    title: {
        type: String,
        required: [true, "Project title is required"],
        trim: true,
        maxlength: [200, "Title cannot be more than 200 charecter"]
    },
    description: {
        type: String,
        required: [true, "Project description is required"],
        trim: true,
        maxlength: [2000 , "Description cannot be more than 2000 charecter"]
    },
    status: {
        type: String,
        default: "pending",
        enum: ["pending", "approved", "rejected", "completed"],
    },
    files: [
        {
            fileType:{
                type: String,
                required: true,
            },
            fileUrl:{
                type: String,
                required: true,
            },
            originalName:{
                type: String,
                required: true,
            },
            uploadedAt:{
                type: String,
                default: Date.now,
            },
                           
        }
    ],
    feedback: [
        {
            supervisorId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
            type: {
                type: String,
                enum: ["positive", "negative", "general"],
                default: "general",
            },
            title: {
                type: String,
                required: true,
            },
            message: {
                type: String,
                required: true,
                maxlength: [2000 , "Feedback cannot be more than 1000 charecter"]
            }
        }
    ],
    deadline: {
        type: Date,
    }
},
{
    timestamps: true,
}
);


// Indexing for better query performance
projectSchema.index({student: 1});
projectSchema.index({supervisor: 1});
projectSchema.index({status: 1});