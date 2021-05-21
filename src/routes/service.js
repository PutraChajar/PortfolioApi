const express = require('express');
const {body} = require('express-validator');
const {getAllServices, createService, updateService, deleteService} = require('../controllers/serviceController');

const router = express.Router();

router.get('/', getAllServices);

router.post(
  '/create',
  body('title').not().isEmpty().withMessage('Title cannot be empty'),
  body('caption').not().isEmpty().withMessage('Caption cannot be empty'),
  body('order').not().isEmpty().withMessage('Order cannot be empty'),
  createService,
);

router.put(
  '/:id',
  body('title').not().isEmpty().withMessage('Title cannot be empty'),
  body('caption').not().isEmpty().withMessage('Caption cannot be empty'),
  body('order').not().isEmpty().withMessage('Order cannot be empty'),
  updateService,
);

router.delete('/:id', deleteService);

module.exports = router;
