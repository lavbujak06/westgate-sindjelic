import express from "express";
import usersRouter from "./routes/users";
import cors from "cors";

const app = express();
const PORT = 4000;

// Middleware
app.use(cors()); // allow requests from your frontend
app.use(express.json());

// Routes
app.use("/users", usersRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
