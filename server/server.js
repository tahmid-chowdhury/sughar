import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });

import express from "express";
import cors from "cors";
import records from "./routes/record.js";
import auth from "./routes/auth.js";
import api from "./routes/api.js";
// Import database connection
import "./db/connection.js";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/record", records);
app.use("/auth", auth);
app.use("/api", api);

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});