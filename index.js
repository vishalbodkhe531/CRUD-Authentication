import express from "express";
import { config } from "dotenv";
import { DatabaseConnection } from "./data/data.js";
import UserRoutes from "./routes/user.routes.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import cookieParser from "cookie-parser";
config({ path: "./config/.env" });

DatabaseConnection();

const server = express();

server.use(cookieParser());

server.use(express.json());

server.use("/api/user", UserRoutes);

server.use(errorMiddleware);
server.listen(process.env.PORT, () => {
  console.log(`Server is working on http://localhost:${process.env.PORT}`);
});
