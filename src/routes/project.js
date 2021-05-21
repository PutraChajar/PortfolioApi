const express = require('express');
const {body} = require('express-validator');
const {getAllProject, getProjectByCategory, createProject, updateProject, deleteProject} = require('../controllers/projectController');

const router = express.Router();

router.get('/', getAllProject);
router.get('/:category', getProjectByCategory);

router.post(
  '/create',
  body('title').not().isEmpty().withMessage('Title cannot be empty'),
  body('subtitle').not().isEmpty().withMessage('Subtitle cannot be empty'),
  body('category').not().isEmpty().withMessage('Category cannot be empty'),
  createProject,
);

router.put(
  '/:id',
  body('title').not().isEmpty().withMessage('Title cannot be empty'),
  body('subtitle').not().isEmpty().withMessage('Title cannot be empty'),
  body('category').not().isEmpty().withMessage('Category cannot be empty'),
  updateProject,
);

router.delete('/:id', deleteProject);

module.exports = router;
