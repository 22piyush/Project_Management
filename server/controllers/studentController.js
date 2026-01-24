import { asyncHandler } from "../middlewares/asyncHandler.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/user.js";
import * as userServices from "../services/userServices.js";
import * as projectServices from "../services/projectServices";


export const getStudentProject = asyncHandler(async (req, res, next) => {

    const studentId = req.user._id;

    const project = await projectServices.getProjectByStudent(studentId);

    if(!project){
        return res.status(200).json({
            success: true,
            data: { project: null },
            message:"No project found for this student"
        });
    }
    return res.status(200).json({
        success: true,
        data: { project },
    });

})
