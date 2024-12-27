
import { GoogleGenerativeAI } from "@google/generative-ai";
import { YoutubeTranscript } from "youtube-transcript";
import fs from "fs";
import PDFDocument from "pdfkit";
import path from "path";

import { Request, Response } from 'express';

export const getPrompt = async(req: Request, res: Response) => {

    try {
        const url = req.body.url;
        console.log(url)
        
        const transcript = await YoutubeTranscript.fetchTranscript("https://youtu.be/z7Uv_A4bG-U?si=AB0OKDX9OGHBu1Sf");
         
        if(!transcript){
          throw new Error("Cannot find Transcript");
        }

        const formattedTranscript = transcript.map((item) => item.text);
    
        const apiKey = process.env.API_KEY;
        if (!apiKey) {
          throw new Error("API_KEY is not defined in the environment variables");
        }
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
        const additionalPrompt =
          " create a full detail blog and make sure no timeline just section name and context also make sure it is easy to understand for students and I want to create it in topicwise such that it is easy to understand for students and remove unnecessary ### symbols like these  ";
    
        const prompt = additionalPrompt + "\n\n" + formattedTranscript.join("\n");
    
        const result = await model.generateContent(prompt);
        const alpha = result.response.text();
    
        fs.writeFileSync("./public/transcript.txt", alpha, "utf-8");

        let cleanedText = alpha.replace(/[#*]/g, ''); 

        const doc = new PDFDocument();
        doc.pipe(fs.createWriteStream("./public/transcript.pdf"));
        doc.fontSize(12);
        doc.moveDown(0.5);
        doc.text(cleanedText);
        doc.end();
    
        res.send(cleanedText);
      } catch (error) {
        console.error("Error fetching transcript:", error);
        res.status(500).send("Error fetching transcript");
      }

}

export const getDownload = (req: Request, res:Response)=>{
    const filePath = path.join(__dirname, "../../public/transcript.pdf");
  res.download(filePath, "document.pdf", (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error downloading the file");
    }
  });
}



