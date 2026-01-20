import { asyncHandler } from "../middlewares/asyncHandler.js"
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/user.js";


export const createStudent = asyncHandler(async (req, res, next) => {

    const {name, email, password, department} = req.body;
    if(!name || !email || !password || !department){
        return next(new ErrorHandler("Please provide all required fields", 400))
    }
    const user =  await 

})