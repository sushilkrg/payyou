import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
app.use(cors());
app.use(express.json());

//routes
app.use("/api/v1/auth", authRoutes);
// app.use("/api/v1/transaction", transactionRoutes);

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running at port ${PORT}`));
});
