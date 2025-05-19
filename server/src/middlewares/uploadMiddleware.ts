import multer, { StorageEngine, FileFilterCallback } from "multer";
import path from "path";
import { Request, Response, NextFunction } from "express";

// Setup storage engine
const storage: StorageEngine = multer.diskStorage({
  destination: "public/uploads/",
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// Accept only image files
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  const allowedTypes = /jpeg|jpg|png|svg|gif|avif/;
  const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = allowedTypes.test(file.mimetype);
  if (extName && mimeType) {
    cb(null, true);
  } else {
    cb(new Error("Only images (JPEG, JPG, PNG, GIF, SVG , avif) are allowed"));
  }
};

// Normalize uploaded file path
const normalizePathMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.file) {
    req.file.path = req.file.path.replace('public/', '');
  }
  if (req.files) {
    const files = Array.isArray(req.files) ? req.files : Object.values(req.files).flat();
    files.forEach(file => {
      file.path = file.path.replace('public/', '');
    });
  }
  next();
};

const uploadSingle = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
}).single("avatar");

const uploadMultiple = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
}).array("images", 5); 

const uploadSingleWithRelativePath = (req: Request, res: Response, next: NextFunction) => {
  uploadSingle(req, res, (err) => {
    if (err) return next(err);
    normalizePathMiddleware(req, res, next);
  });
};

const uploadMultipleWithRelativePath = (req: Request, res: Response, next: NextFunction) => {
  uploadMultiple(req, res, (err) => {
    if (err) return next(err);
    normalizePathMiddleware(req, res, next);
  });
};

export {
  uploadSingle,
  uploadMultiple,
  uploadSingleWithRelativePath,
  uploadMultipleWithRelativePath
};
