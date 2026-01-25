import express from "express";
import multer from "multer";
import {
  isAuthenticated,
  isAuthorized,
} from "../middlewares/authMiddleware.js";

import {
  handleUploadError,
  upload,
} from "../middlewares/upload.js";

import {
  getAvailableSupervisors,
  getStudentProject,
  submitProposal,
  uploadFiles,
} from "../controllers/studentController.js";

const router = express.Router();

// ROLE:- STUDENT RELATED ROUTES
router.post(
  "/project",
  isAuthenticated,
  isAuthorized("Student"),
  getStudentProject,
);
router.post(
  "/project-proposal",
  isAuthenticated,
  isAuthorized("Student"),
  submitProposal,
);
router.post(
  "upload/:projectId",
  isAuthenticated,
  isAuthorized("Student"),
  upload.array("files", 10),
  handleUploadError,
  uploadFiles,
);


// ROLE:- ALL SUPERVISOR ROUTES
router.get("/fetch-supervisor", isAuthenticated, isAuthorized("Student"), getAvailableSupervisors);

export default router;
