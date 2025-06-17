import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import walletRoutes from "./routes/walletRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
app.use(cors());
app.use(express.json());
app.use(cookieParser());

//routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/wallet", walletRoutes);
app.use("/api/v1/transactions", transactionRoutes);

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running at port ${PORT}`));
});
