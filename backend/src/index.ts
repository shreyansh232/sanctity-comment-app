import express from "express";
import dotenv from "dotenv";
dotenv.config();
import authRoutes from "./routes/auth.routes";
import commentRoutes from "./routes/comment.routes";
import notificationRoutes from "./routes/notification.routes";
import db from "./config/db";
import cors from "cors";

const app = express();
const port = process.env.PORT || 8088;

app.use(express.json());
app.use(cors());

db.connect()
  .then((client) => {
    console.log("Connected to PostgreSQL database!");
    client.release(); // Release the client back to the pool
  })
  .catch((err) => {
    console.error("Error connecting to PostgreSQL database:", err.message);
    process.exit(1); // Exit if DB connection fails
  });
app.use("/api/auth", authRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/notifications", notificationRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
