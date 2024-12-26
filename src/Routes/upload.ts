import cloudinary from "cloudinary";

import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

cloudinary.v2.config({
  cloud_name: "dpvt2kpli",
  api_key: "336268579743768",
  api_secret: process.env.ClOUD_KEY,
  secure: true,
});

import { Request, Response } from "express";

export const uploadRouter = async (req: Request, res: Response) => {
  try {
    const pdfPath = path.join(__dirname, "../../transcript.txt");

    const result = await cloudinary.v2.uploader.upload(pdfPath, {
      resource_type: "raw",
      folder: "pdf_uploads",
    });

    res.status(200).json({
      message: "PDF uploaded successfully",
      url: result.secure_url,
    });
  } catch (error) {
    console.error("Error uploading PDF to Cloudinary:", error);
    res.status(500).json({ message: "Failed to upload PDF", error });
  }
};
