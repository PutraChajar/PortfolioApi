const {validationResult} = require('express-validator');
const skillModel = require('../models/skillModel');
const path = require('path');
const fs = require('fs');

const getAllSkill = (req, res, next) => {
  skillModel.find()
  .then((result) => {
    res.status(200).json({
      message: 'Skill items retrieved successfully',
      data: result,
    });
  })
  .catch((err) => {
    next(err);
  });
};

const getSkillByCategory = (req, res, next) => {
  const category = req.params.category;

  skillModel.find({
    category: category,
  })
  .then((result) => {
    if (!result) {
      const error = new Error('Data not found');
      error.errorStatus = 404;
      throw error;
    }
    res.status(200).json({
      message: 'Skill items retrieved successfully',
      data: result,
    });
  })
  .catch((err) => {
    next(err);
  });
};

const createSkill = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const err = new Error('Invalid value');
    err.errorStatus = 400;
    err.data = errors.array();
    throw err;
  }

  if (!req.file) {
    const err = new Error('Image null');
    err.errorStatus = 422;
    throw err;
  }

  const {title, category} = req.body;
  const logo = req.file.path;
  const skill = new skillModel({
    title: title,
    category: category,
    logo: logo,
  });

  skill.save()
  .then((result) => {
    res.status(201).json({
      message: 'Create data success',
      data: result,
    });
  })
  .catch((err) => {
    res.json({
      status: 'error',
      message: err,
    });
  });
};

const updateSkill = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const err = new Error('Invalid value');
    err.errorStatus = 400;
    err.data = errors.array();
    throw err;
  }

  const id = req.params.id;
  const {title, category} = req.body;
  const logo = req.file.path;

  skillModel.findById(id)
  .then((data) => {
    if (!data) {
      const err = new Error('Data not found');
      err.errorStatus = 404;
      throw err;
    }
    removeImage(data.logo);

    data.title = title;
    data.category = category;
    data.logo = logo;

    return data.save();
  })
  .then((result) => {
    res.status(200).json({
      message: 'Update data success',
      data: result,
    });
  })
  .catch((err) => {
    next(err);
  });
};

const deleteSkill = (req, res, next) => {
  const id = req.params.id;

  skillModel.findById(id)
  .then((data) => {
    if (!data) {
      const error = new Error('Data not found');
      error.errorStatus = 404;
      throw error;
    }

    removeImage(data.logo);
    return skillModel.findByIdAndRemove(id);
  })
  .then((result) => {
    res.status(200).json({
      message: 'Delete data success',
      data: result,
    });
  })
  .catch((err) => {
    next(err);
  });
};

const removeImage = (filePath) => {
  filePath = path.join(__dirname, '../..', filePath);
  fs.unlink(filePath, (err) => console.log(err));
};

module.exports = {getAllSkill, getSkillByCategory, createSkill, updateSkill, deleteSkill};
