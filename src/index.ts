import express from "express";

import dotenv from "dotenv";

import {uploadRouter} from "./Routes/upload";
import cors from "cors";
import { getDownload } from "./Routes/blog";
import { getPrompt } from "./Routes/blog";

const app = express();

app.use(cors());
app.use(express.json());

dotenv.config({ path: "./.env" });


app.post("/transcript",getPrompt);

app.get("/upload", uploadRouter);

app.get("/download",getDownload)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
