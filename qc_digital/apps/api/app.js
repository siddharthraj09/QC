import express from "express";
import { PrismaClient } from "@prisma/client";
import multer from "multer";
// For working with file paths
import path from "path";
import fs from "fs";
import * as dotenv from "dotenv";
import cors from "cors";
import { PDFDocument } from "pdf-lib";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 4000;
app.use(express.json());
import bodyParser from "body-parser";

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
// Preflight CORS:
app.options("*", cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Multer Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads"); // Store images in an 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique filenames
  },
});
const upload = multer({
  storage,
  limits: {
    fieldSize: 25 * 1024 * 1024, // 25 MB limit for individual files
  },
});
app.use(upload.single("image"));
app.post("/api/image-upload", async (req, res) => {
  try {
    const { image, commodity } = req.body;

    const pdfDoc = await PDFDocument.create();
    const jpgImageBytes = await fetch(image).then((res) => res.arrayBuffer());

    const images = await pdfDoc.embedJpg(jpgImageBytes);

    const imageDims = images.scale(0.5);

    const page = pdfDoc.addPage();
    page.drawText(commodity, { x: 50, y: page.getHeight() - 100 }); // Add commodity text
    page.drawImage(images, {
      x: 50,
      y: page.getHeight() - imageDims.height - 75,
      width: imageDims.width,
      height: imageDims.height,
    });

    const pdfBytes = await pdfDoc.save();

    // **File System Storage (Example)**
    const fileName = `${Date.now()}.pdf`;
    const filePath = `./uploads/${fileName}`;
    fs.writeFileSync(filePath, pdfBytes);

    // **Database Storage**

    const pdfData = await prisma.report.create({
      data: {
        imagePath: filePath.slice(1), // Or the uploaded URL
        commodity: {
          connectOrCreate: {
            where: { name: commodity },
            create: { name: commodity },
          },
        },
        // Other fields as needed
      },
    });

    res.status(200).json({ pdfData });
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ error: "PDF generation failed" });
  }
});
app.get("/api/reports", async (req, res) => {
  try {
    const allReports = await prisma.report.findMany({
      // Include associated commodity data
    });

    res.status(200).json(allReports);
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
});
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Start the Server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
