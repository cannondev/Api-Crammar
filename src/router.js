import { Router } from "express";
import multer from "multer"; // for handling file uploads
import * as Docs from "./controllers/doc_controller.js";
import { uploadAndExtractDoc } from "./controllers/doc_controller.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from './models/user_model.js';
import { authenticateJWT } from './middleware/auth.js';

const router = Router();
const upload = multer({ dest: "uploads/" });
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// ----------------------------------------------------
// Routes adapted from my CS52 lab5
router.get("/", (req, res) => {
  res.json({ message: "Welcome to the Crammar api!" });
});

router.post("/docs/upload", authenticateJWT, upload.single("pdf"), async (req, res) => {
  try {
    const savedDoc = await uploadAndExtractDoc(
      req, // need to send req to controller to access file
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
    const userId = req.user._id;
    const result = await Docs.getDocs(userId);
    // send back the result
    res.json(result);
  } catch (error) {
    // or catch the error and send back an error
    res.status(500).json({ error });
  }
};

router.route("/docs").get(authenticateJWT, handleGetDocs);

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

// Authentication routes
// ----------------------------------------------------

// Register handler - authentication implemented with VS Copilot
export async function registerUser(req, res) {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({ username, password: hashedPassword });
    res.json({ message: 'User registered', userId: user._id });
  } catch (err) {
    res.status(400).json({ error: 'User already exists' });
  }
}

// Login handler - authentication implemented with VS Copilot
export async function loginUser(req, res) {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token });
}

// Register route
router.post('/auth/register', registerUser);

// Login route
router.post('/auth/login', loginUser);

export default router;
