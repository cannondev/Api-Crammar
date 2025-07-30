import Doc from "../models/doc_model.js";
import os from "os"; // for temporary file storage
import fs from "fs"; // for file operations
import path from "path"; 

// the following imports are for Adobe PDF Services
import {
  ServicePrincipalCredentials,
  PDFServices,
  MimeType,
  ExtractPDFParams,
  ExtractElementType,
  ExtractPDFJob,
  ExtractPDFResult,
} from "@adobe/pdfservices-node-sdk";
import AdmZip from "adm-zip";

// openAI API usage
import { genDocSummary } from "./openai_controller.js";

// Create a new document instance
export async function createDoc(docFields) {
  const doc = new Doc({
    title: docFields.title,
    fileName: docFields.fileName,
    content: docFields.content,
    pdfUrl: docFields.pdfUrl,
    summary: docFields.summary,
    wordArray: docFields.wordArray,
  });

  try {
    const savedDoc = await doc.save();
    return savedDoc;
  } catch (error) {
    throw new Error(`create doc error: ${error}`);
  }
}

// Get all docs
export async function getDocs() {
  try {
    return await Doc.find();
  } catch (error) {
    throw new Error(`get docs error: ${error}`);
  }
}

// Get single doc by ID
export async function getDoc(id) {
  try {
    const doc = await Doc.findById(id);
    if (!doc) throw new Error("Document not found");
    return doc;
  } catch (error) {
    throw new Error(`get doc by id error: ${error}`);
  }
}

// Delete doc by ID
export async function deleteDoc(id) {
  try {
    await Doc.findByIdAndDelete(id);
    return { message: "Doc deleted successfully" };
  } catch (error) {
    throw new Error(`delete doc error: ${error}`);
  }
}

// Upload and extract PDF via Adobe API
// This function handles the file upload, extraction, and saving to the database
// https://developer.adobe.com/document-services/docs/overview/pdf-extract-api/quickstarts/nodejs/
export async function uploadAndExtractDoc(req, file, originalName, givenTitle) {
  let readStream;
  let outputPath;
  try {
    // Initial setup, create credentials instance
    const credentials = new ServicePrincipalCredentials({
      clientId: process.env.PDF_SERVICES_CLIENT_ID,
      clientSecret: process.env.PDF_SERVICES_CLIENT_SECRET,
    });

    // Creates a PDF Services instance
    const pdfServices = new PDFServices({ credentials });

    // Creates an asset(s) from source file(s) and upload
    readStream = fs.createReadStream(file.path);
    const inputAsset = await pdfServices.upload({
      readStream,
      mimeType: MimeType.PDF,
    });

    // Create parameters for the job
    const params = new ExtractPDFParams({
      elementsToExtract: [ExtractElementType.TEXT],
    });

    // Creates a new job instance
    const job = new ExtractPDFJob({ inputAsset, params });

    // Submit the job and get the job result
    const pollingURL = await pdfServices.submit({ job });
    const pdfServicesResponse = await pdfServices.getJobResult({
      pollingURL,
      resultType: ExtractPDFResult,
    });

    // Get content from the resulting asset(s)
    const resultAsset = pdfServicesResponse.result.resource;
    const streamAsset = await pdfServices.getContent({ asset: resultAsset });

    // Creates a write stream and copy stream asset's content to it
    outputPath = path.join(os.tmpdir(), `output_${Date.now()}.zip`); // Temporary file path for each new doc, date.now gives unique file name - provided by chatGPT
    const writeStream = fs.createWriteStream(outputPath);
    streamAsset.readStream.pipe(writeStream);

    // Wait for the stream to finish
    await new Promise((resolve, reject) => {
      writeStream.on("finish", resolve);
      writeStream.on("error", reject);
    });

    // Unzip and parse
    const zip = new AdmZip(outputPath);
    const jsondata = zip.readAsText("structuredData.json");
    const data = JSON.parse(jsondata);

    // Build word array - provided by chatGPT
    const allText = data.elements
      .filter((el) => el.Text)
      .map((el) => el.Text)
      .join(" ");
    const wordArray = allText.split(/\s+/).filter(Boolean);

    // OpenAI Integration - uses allText to generate summary of the pdf
    const summary = await genDocSummary(allText);

    // Create PDF URL for the uploaded file for react-pdf
    const pdfUrl = `${req.protocol}://${req.get("host")}/uploads/${
      req.file.filename
    }`;

    // Save to database
    const doc = new Doc({
      title: givenTitle,
      fileName: originalName,
      content: allText,
      summary: summary,
      pdfUrl, // persist
      wordArray,
    });
    const savedDoc = await doc.save();

    return savedDoc;
  } catch (err) {
    console.error("Adobe PDF extract error:", err);
    throw new Error(`Adobe PDF extract failed: ${err.message}`);
  } finally {
    readStream?.destroy();
    try {
      if (outputPath) fs.unlinkSync(outputPath.path);
    } catch {}
  }
}
