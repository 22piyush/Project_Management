import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

const ensureDirExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const storage = multer.diskStorage({
  // destination: (req, file, cb) => {
  //   let uploadPath;

  //   if (req.route.path.include("/upload/:projectId")) {
  //     uploadPath = path.join(
  //       _dirname,
  //       "../uploads/projects",
  //       req.params.projectId,
  //     );
  //   } else if (req.route.path.include("/upload/:userId")) {
  //     uploadPath = path.join(_dirname, "../uploads/users", req.params.userId);
  //   } else {
  //     uploadPath = path.join(_dirname, "../uploads/temp");
  //   }

  //   ensureDirExists(uploadPath);
  //   cb(null, uploadPath);
  // },

  destination: (req, file, cb) => {
    let uploadPath;

    if (req.route.path.includes("/upload/:projectId")) {
      uploadPath = path.join(
        _dirname,
        "../uploads/projects",
        req.params.projectId
      );
    } else if (req.route.path.includes("/upload/:userId")) {
      uploadPath = path.join(
        _dirname,
        "../uploads/users",
        req.params.userId
      );
    } else {
      uploadPath = path.join(_dirname, "../uploads/temp");
    }

    ensureDirExists(uploadPath);
    cb(null, uploadPath);
  },


  // filename: (req, file, cb) => {
  //   const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  //   const ext = path.extname(file.originalname);
  //   cb(null, `${file.filename}-${uniqueSuffix}${ext}`);
  // },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${baseName}-${uniqueSuffix}${ext}`);
  },

});

const fileFilter = (req, file, cb) => {

  const allowedTypes = [
    // Web files
    "text/html",
    "text/css",
    "application/javascript",
    "text/javascript",

    // Documents
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

    // Excel
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

    // PowerPoint
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",

    // Text / Data
    "text/plain",
    "text/csv",
    "application/json",

    // Images
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/gif",
    "image/webp",
  ];

  const allowedExtensions = [
    // Web
    ".html",
    ".htm",
    ".css",
    ".js",

    // Documents
    ".pdf",
    ".doc",
    ".docx",

    // Excel
    ".xls",
    ".xlsx",

    // PowerPoint
    ".ppt",
    ".pptx",

    // Text / Data
    ".txt",
    ".csv",
    ".json",

    // Images
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".webp",
  ];

  const fileExt = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(file.mimetype) || allowedExtensions.includes(fileExt)) {
    cb(null, true)
  } else {
    cb(new Error("Invalid file type. Only PDF, DOCX, PPTS, ZIP, RAR, IMAGES and code files are allowed."), false);
  }
};


const upload = multer({
  storage, fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 10,
  },
});



const handleUploadError = (err, req, res, next) => {

  if (err instanceof multer.MulterError) {

    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        error: "File to large. Maximum size is 10MB",
      });
    }

    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        success: false,
        error: "Too many files. Maximum 10 files allowed",
      });
    }


    if (err.message && err.message.includes("Invalid file type")) {
      return res.status(400).json({
        success: false,
        error: err.message,
      });
    }

  }

  next(err);

};


export { upload, handleUploadError };
