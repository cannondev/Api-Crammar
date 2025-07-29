import { Router } from 'express';
import * as Docs from './controllers/doc_controller.js';
import { uploadAndExtractDoc } from './controllers/doc_controller.js';
import multer from 'multer';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Crammar api!' });
});

// ----------------------------------------------------

// Routes
const upload = multer({ dest: 'uploads/'})

router.post('/docs/upload', upload.single('pdf'), async (req, res) => {
  console.log('Upload route hit. req.file:', req.file);
  try {
    const result = await uploadAndExtractDoc(req.file, req.file.originalname, req.body.title);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const handleCreateDoc = async (req, res) => {
  try {
    // use req.body etc to await some contoller function
    const result = await Docs.createDoc(req.body);
    // send back the result
    res.json(result);
  } catch (error) {
    // or catch the error and send back an error
    res.status(500).json({ error });
  }
};

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

router.route('/docs')
  .post(handleCreateDoc)
  .get(handleGetDocs);

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

router.route('/docs/:id')
  .get(handleGetDoc)
  .delete(handleDeleteDoc);

export default router;
