import Doc from "../models/doc_model.js";
import fs from "fs";
import path from "path";
import unzipper from "unzipper";
import {
  ServicePrincipalCredentials,
  PDFServices,
  MimeType,
  ExtractPDFParams,
  ExtractElementType,
  ExtractPDFJob,
  ExtractPDFResult
} from "@adobe/pdfservices-node-sdk";
import AdmZip from "adm-zip";

// Create doc from plain fields (e.g., used by non-file form)
export async function createDoc(docFields) {
  const doc = new Doc({
    title: docFields.title,
    content: docFields.content,
    coverUrl: docFields.coverUrl,
    description: docFields.description,
    wordArray: docFields.wordArray || (docFields.content?.split(/\s+/) ?? []),
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

// Update doc
export async function updateDoc(id, docFields) {
  try {
    return await Doc.findByIdAndUpdate(id, docFields, { new: true });
  } catch (error) {
    throw new Error(`update doc error: ${error}`);
  }
}

// Upload and extract PDF via Adobe API
export async function uploadAndExtractDoc(file) {
  let readStream;
  try {
    // 1. Credentials from env
    const credentials = new ServicePrincipalCredentials({
      clientId: process.env.PDF_SERVICES_CLIENT_ID,
      clientSecret: process.env.PDF_SERVICES_CLIENT_SECRET
    });

    // 2. PDF Services instance
    const pdfServices = new PDFServices({ credentials });

    // 3. Upload PDF
    readStream = fs.createReadStream(file.path);
    const inputAsset = await pdfServices.upload({
      readStream,
      mimeType: MimeType.PDF
    });

    // 4. Set up extract params
    const params = new ExtractPDFParams({
      elementsToExtract: [ExtractElementType.TEXT]
    });

    // 5. Create and submit job
    const job = new ExtractPDFJob({ inputAsset, params });
    const pollingURL = await pdfServices.submit({ job });
    const pdfServicesResponse = await pdfServices.getJobResult({
      pollingURL,
      resultType: ExtractPDFResult
    });

    // 6. Get result asset and save ZIP
    const resultAsset = pdfServicesResponse.result.resource;
    const streamAsset = await pdfServices.getContent({ asset: resultAsset });
    const outputPath = `output_${Date.now()}.zip`;
    const writeStream = fs.createWriteStream(outputPath);
    streamAsset.readStream.pipe(writeStream);

    // Wait for the stream to finish
    await new Promise((resolve, reject) => {
      writeStream.on("finish", resolve);
      writeStream.on("error", reject);
    });

    // 7. Extract and parse JSON
    const zip = new AdmZip(outputPath);
    const jsondata = zip.readAsText('structuredData.json');
    const data = JSON.parse(jsondata);

    // 8. Extract text and build word array
    const allText = data.elements
      .filter((el) => el.Text)
      .map((el) => el.Text)
      .join(" ");
    const wordArray = allText.split(/\s+/).filter(Boolean);

    // 9. Save to DB (your existing logic)
    const doc = new Doc({
      title: path.basename(file.originalname, ".pdf"),
      content: allText,
      wordArray,
    });
    const savedDoc = await doc.save();

    // Cleanup temp files
    fs.unlinkSync(file.path);
    fs.unlinkSync(outputPath);

    return savedDoc;
  } catch (err) {
    console.error("Adobe PDF extract error:", err);
    throw new Error(`Adobe PDF extract failed: ${err.message}`);
  } finally {
    readStream?.destroy();
  }
}
