const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

const app = express();
const database = require('./config/database');
const socialRoutes = require('./routes/social');
const aboutRoutes = require('./routes/about');
const serviceRoutes = require('./routes/service');
const skillRoutes = require('./routes/skill');
const projectRoutes = require('./routes/project');

database.connection.on('error', console.error.bind(console, 'MongoDB Connection Error:'));

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + '-' + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/webp') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(cors());
app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, '..', 'images')));
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'));
app.use('/files', express.static(path.join(__dirname, '..', 'files')));

app.use('/v1/social', socialRoutes);
app.use('/v1/about', aboutRoutes);
app.use('/v1/service', serviceRoutes);
app.use('/v1/skill', skillRoutes);
app.use('/v1/project', projectRoutes);

app.use((error, req, res, next) => {
  const status = error.errorStatus || 500;
  const message = error.message;
  const data = error.data;

  res.status(status).json({message: message, data: data});
});

app.listen(4000, () => {
  console.log(`Server running on port 4000`);
});
