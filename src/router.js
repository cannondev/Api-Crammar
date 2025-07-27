import { Router } from 'express';
import * as Docs from './controllers/doc_controller';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Crammar api!' });
});

/// your routes will go here

// on routes ending in /someroute
// ----------------------------------------------------

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
    const result = await Posts.deleteDoc(req.params.id);
    // send back the result
    res.json(result);
  } catch (error) {
    // or catch the error and send back an error
    res.status(404).json({ error });
  }
};

router.route('/docs/:id')
  .get(handleGetDoc)
  .delete(handleDeletePost);

export default router;
