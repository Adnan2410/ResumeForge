import express from "express";
import multer from "multer";
import {
  customizeResume,
  downloadCustomizedPdf,
} from "../controllers/customizeResumeController.js";
const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post('/', upload.single("resume"), customizeResume);
router.post('/download-pdf', express.json(), downloadCustomizedPdf);

export default router;