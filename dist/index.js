"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const upload_1 = require("./Routes/upload");
const cors_1 = __importDefault(require("cors"));
const blog_1 = require("./Routes/blog");
const blog_2 = require("./Routes/blog");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
dotenv_1.default.config({ path: "./.env" });
app.get("/transcript", blog_2.getPrompt);
app.get("/upload", upload_1.uploadRouter);
app.get("/download", blog_1.getDownload);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
