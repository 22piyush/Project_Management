import express from "express";
import  multer from "multer";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

import { createStudent, deleteStudent, updateStudent } from "../controllers/adminController.js";



const router = express.Router();

router.post("/create-student", isAuthenticated, isAuthorized("Admin"), createStudent);
router.put("/update-student/:id", isAuthenticated, isAuthorized("Admin"), updateStudent);
router.delete("/delete-student/:id", isAuthenticated, isAuthorized("Admin"), deleteStudent);


export default router;
