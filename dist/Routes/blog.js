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
exports.getDownload = exports.getPrompt = void 0;
const generative_ai_1 = require("@google/generative-ai");
const youtube_transcript_1 = require("youtube-transcript");
const fs_1 = __importDefault(require("fs"));
const pdfkit_1 = __importDefault(require("pdfkit"));
const path_1 = __importDefault(require("path"));
const getPrompt = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const url = req.body.url;
        const transcript = yield youtube_transcript_1.YoutubeTranscript.fetchTranscript(url);
        const formattedTranscript = transcript.map((item) => item.text);
        const apiKey = process.env.API_KEY;
        if (!apiKey) {
            throw new Error("API_KEY is not defined in the environment variables");
        }
        const genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const additionalPrompt = " create a full detail blog and make sure no timeline just section name and context also make sure it is easy to understand for students and I want to create it in topicwise such that it is easy to understand for students and remove unnecessary ### symbols like these  ";
        const prompt = additionalPrompt + "\n\n" + formattedTranscript.join("\n");
        const result = yield model.generateContent(prompt);
        const alpha = result.response.text();
        fs_1.default.writeFileSync("./public/transcript.txt", alpha, "utf-8");
        let cleanedText = alpha.replace(/[#*]/g, '');
        const doc = new pdfkit_1.default();
        doc.pipe(fs_1.default.createWriteStream("./public/transcript.pdf"));
        doc.fontSize(12);
        doc.moveDown(0.5);
        doc.text(cleanedText);
        doc.end();
        res.send(cleanedText);
    }
    catch (error) {
        console.error("Error fetching transcript:", error);
        res.status(500).send("Error fetching transcript");
    }
});
exports.getPrompt = getPrompt;
const getDownload = (req, res) => {
    const filePath = path_1.default.join(__dirname, "../../public/transcript.pdf");
    res.download(filePath, "document.pdf", (err) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error downloading the file");
        }
    });
};
exports.getDownload = getDownload;
