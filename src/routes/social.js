const express = require('express');
const {body} = require('express-validator');
const {getAllSocials, getSocialById, createSocial, updateSocial, deleteSocial} = require('../controllers/socialController');

const router = express.Router();

router.get('/', getAllSocials);
router.get('/:id', getSocialById);

router.post(
  '/create',
  body('name').not().isEmpty().withMessage('Name cannot be empty'),
  body('link').not().isEmpty().withMessage('Link cannot be empty'),
  createSocial,
);

router.put(
  '/:id',
  body('name').not().isEmpty().withMessage('Name cannot be empty'),
  body('link').not().isEmpty().withMessage('Link cannot be empty'),
  updateSocial,
);

router.delete('/:id', deleteSocial);

module.exports = router;
