const express = require('express');
const {body} = require('express-validator');
const {getAllAbouts, createAbout, updateAbout, deleteAbout} = require('../controllers/aboutController');

const router = express.Router();

router.get('/', getAllAbouts);

router.post(
  '/create',
  body('title').not().isEmpty().withMessage('Title cannot be empty'),
  body('caption').not().isEmpty().withMessage('Caption cannot be empty'),
  createAbout,
);

router.put(
  '/:id',
  body('title').not().isEmpty().withMessage('Title cannot be empty'),
  body('caption').not().isEmpty().withMessage('Caption cannot be empty'),
  updateAbout,
);

router.delete('/:id', deleteAbout);

module.exports = router;
