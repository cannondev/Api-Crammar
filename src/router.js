import { Router } from "express";
import multer from "multer";
import * as Docs from "./controllers/doc_controller.js";
import { uploadAndExtractDoc } from "./controllers/doc_controller.js";

const router = Router();
const upload = multer({ dest: "uploads/" });

// ----------------------------------------------------
// Routes
router.get("/", (req, res) => {
  res.json({ message: "Welcome to the Crammar api!" });
});

router.post("/docs/upload", upload.single("pdf"), async (req, res) => {
  try {
    const savedDoc = await uploadAndExtractDoc(
      req,
      req.file,
      req.file.originalname,
      req.body.title
    );
    res.json(savedDoc);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const handleGetDocs = async (req, res) => {
  try {
    // use req.body etc to await some contoller function
    const result = await Docs.getDocs();
    // send back the result
    res.json(result);
  } catch (error) {
    // or catch the error and send back an error
    res.status(500).json({ error });
  }
};

router.route("/docs").get(handleGetDocs);

// on routes ending in /someroute/:someID
// ----------------------------------------------------

const handleGetDoc = async (req, res) => {
  try {
    // use req.body etc to await some contoller function
    const result = await Docs.getDoc(req.params.id);
    // send back the result
    res.json(result);
  } catch (error) {
    // or catch the error and send back an error
    res.status(404).json({ error });
  }
};

const handleDeleteDoc = async (req, res) => {
  try {
    // use req.body etc to await some contoller function
    const result = await Docs.deleteDoc(req.params.id);
    // send back the result
    res.json(result);
  } catch (error) {
    // or catch the error and send back an error
    res.status(404).json({ error });
  }
};

router.route("/docs/:id").get(handleGetDoc).delete(handleDeleteDoc);

export default router;
