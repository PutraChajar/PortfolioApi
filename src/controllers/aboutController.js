const {validationResult} = require('express-validator');
const aboutModel = require('../models/aboutModel');

const getAllAbouts = (req, res, next) => {
  aboutModel.find()
  .then((result) => {
    res.status(200).json({
      message: 'About items retrieved successfully',
      data: result,
    });
  })
  .catch((err) => {
    next(err);
  });
};

const createAbout = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const err = new Error('Invalid value');
    err.errorStatus = 400;
    err.data = errors.array();
    throw err;
  }

  const {title, caption} = req.body;
  const about = new aboutModel({
    title: title,
    caption: caption,
  });

  about.save()
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

const updateAbout = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const err = new Error('Invalid value');
    err.errorStatus = 400;
    err.data = errors.array();
    throw err;
  }

  const id = req.params.id;
  const {title, caption} = req.body;

  aboutModel.findById(id)
  .then((data) => {
    if (!data) {
      const err = new Error('Data not found');
      err.errorStatus = 404;
      throw err;
    }

    data.title = title;
    data.caption = caption;

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

const deleteAbout = (req, res, next) => {
  const id = req.params.id;

  aboutModel.findById(id)
  .then((data) => {
    if (!data) {
      const error = new Error('Data not found');
      error.errorStatus = 404;
      throw error;
    }

    return aboutModel.findByIdAndRemove(id);
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

module.exports = {getAllAbouts, createAbout, updateAbout, deleteAbout};
