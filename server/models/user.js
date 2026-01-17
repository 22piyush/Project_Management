import bcrypt from "bcrypt";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        maxlength: [50, "Name cannot exceed 50 characters"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
            "Please enter a valid email address"
        ]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        select: false,
        minlength: [8, "Password must be at least 8 characters long"]
    },
    role: {
        type: String,
        default: "Student",
        enum: ["Student", "Teacher", "Admin"]
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    department: {
        type: String,
        trim: true,
        default: null,
    },
    experties: {
        type: [String],
        default: [],
    },
    maxStudents: {
        type: Number,
        default: 10,
        min: [1, "Min Students must be at least 1"]
    },
    assignedStudents: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    supervisor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        default: null,
    },
}, {
    timestamps: true,
});

userSchema.methods.generateToken = function(){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
}

export const User = mongoose.model("User", userSchema);
