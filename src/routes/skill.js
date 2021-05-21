const express = require('express');
const {body} = require('express-validator');
const {getAllSkill, getSkillByCategory, createSkill, updateSkill, deleteSkill} = require('../controllers/skillController');

const router = express.Router();

router.get('/', getAllSkill);
router.get('/:category', getSkillByCategory);

router.post(
  '/create',
  body('title').not().isEmpty().withMessage('Title cannot be empty'),
  body('category').not().isEmpty().withMessage('Category cannot be empty'),
  createSkill,
);

router.put(
  '/:id',
  body('title').not().isEmpty().withMessage('Title cannot be empty'),
  body('category').not().isEmpty().withMessage('Category cannot be empty'),
  updateSkill,
);

router.delete('/:id', deleteSkill);

module.exports = router;
