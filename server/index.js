import dotenv from "dotenv";
dotenv.config(); 
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import customizeRoutes from "./routes/customizeRoutes.js";
import { protect } from "./middleware/authMiddleware.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 8000;
const allowedOrigin = process.env.CLIENT_URL || "http://localhost:5173";

app.use(cors({
    origin: allowedOrigin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// IMPORTANT: Ensure you serve your uploads folder so images/resumes can be seen
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Use regex instead of "*" to avoid the path-to-regexp error
app.options(/(.*)/, cors()); 

app.use(express.json());

// 2. Database Connection
connectDB();

// 3. Routes
app.get("/", (req, res) => {
  res.send("SmartResume Backend is working");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/resume", protect, resumeRoutes);
app.use("/api/customize-resume", protect, customizeRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});