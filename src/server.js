import express from 'express';
import cors from 'cors';
import path from 'path';
import morgan from 'morgan';
import mongoose from 'mongoose';
import apiRoutes from './router.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

// much of this code is boilerplate from CS52 Kahoot API Short Assignment

// initialize
const app = express();

// get the current directory name and file name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(cors());

app.use(morgan('dev'));

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, '../src/views'));

// enable json message body for posting data to API
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // To parse the incoming requests with JSON payloads

// additional init stuff should go before hitting the routing
// this is used to find pdf files for given docs, to render them in the react-pdf viewer, 
// CORS headers for static files in /uploads, provided by Copilot 
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Or specify your frontend URL instead of '*'
  res.header('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
// this should go AFTER body parser
app.use('/api', apiRoutes);

// default index route
app.get('/', (req, res) => {
  res.send('hi');
});

// START THE SERVER
// =============================================================================
async function startServer() {
  try {
    // connect DB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/crammar_db';
    await mongoose.connect(mongoURI);
    console.log(`Mongoose connected to: ${mongoURI}`);

    const port = process.env.PORT || 9090;
    app.listen(port);

    console.log(`Listening on port ${port}`);
  } catch (error) {
    console.error(error);
  }
}

startServer();
