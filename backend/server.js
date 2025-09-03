import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// --- IMPORT ROUTE HANDLERS ---
import authRoutes from './routes/auth.mjs';
import userRoutes from './routes/users.mjs';
import requestRoutes from './routes/requests.mjs';
import adminRoutes from './routes/admin.mjs';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
// const MONGO_URI = "mongodb+srv://khengar:khengar1234@cluster0.otvbhlu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const MONGO_URI = process.env.MONGO_URI;
// --- CORE MIDDLEWARE ---
app.use(cors());
app.use(express.json());

// --- DATABASE CONNECTION ---
mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch(err => console.error("MongoDB connection error ❌", err));

// --- API ROUTES ---
// Delegate requests to the appropriate route handlers
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/admin', adminRoutes);

// --- SERVER START ---
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} ✅`);
});
