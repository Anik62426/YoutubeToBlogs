"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadRouter = void 0;
const cloudinary_1 = __importDefault(require("cloudinary"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: "./.env" });
cloudinary_1.default.v2.config({
    cloud_name: "dpvt2kpli",
    api_key: "336268579743768",
    api_secret: process.env.ClOUD_KEY,
    secure: true,
});
const uploadRouter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pdfPath = path_1.default.join(__dirname, "../../public/transcript.txt");
        const result = yield cloudinary_1.default.v2.uploader.upload(pdfPath, {
            resource_type: "raw",
            folder: "pdf_uploads",
        });
        res.status(200).json({
            message: "PDF uploaded successfully",
            url: result.secure_url,
        });
    }
    catch (error) {
        console.error("Error uploading PDF to Cloudinary:", error);
        res.status(500).json({ message: "Failed to upload PDF", error });
    }
});
exports.uploadRouter = uploadRouter;
