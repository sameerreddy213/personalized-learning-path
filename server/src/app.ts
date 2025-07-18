// src/app.ts

import express from "express";
import bodyParser from "body-parser";
import learningPathRoutes from "./routes/learningPath";

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use("/api", learningPathRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
