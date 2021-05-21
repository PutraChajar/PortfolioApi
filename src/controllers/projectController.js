const {validationResult} = require('express-validator');
const projectModel = require('../models/projectModel');
const path = require('path');
const fs = require('fs');

const getAllProject = (req, res, next) => {
  projectModel.find()
  .then((result) => {
    res.status(200).json({
      message: 'Project items retrieved successfully',
      data: result,
    });
  })
  .catch((err) => {
    next(err);
  });
};

const getProjectByCategory = (req, res, next) => {
  const category = req.params.category;

  projectModel.find({
    category: category,
  })
  .then((result) => {
    if (!result) {
      const error = new Error('Data not found');
      error.errorStatus = 404;
      throw error;
    }
    res.status(200).json({
      message: 'Project items retrieved successfully',
      data: result,
    });
  })
  .catch((err) => {
    next(err);
  });
};

const createProject = (req, res, next) => {
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

  const {title, subtitle, category, links} = req.body;
  const mockup = req.file.path;
  const project = new projectModel({
    title: title,
    subtitle: subtitle,
    category: category,
    mockup: mockup,
    links: links,
  });

  project.save()
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

const updateProject = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const err = new Error('Invalid value');
    err.errorStatus = 400;
    err.data = errors.array();
    throw err;
  }

  const id = req.params.id;
  const {title, subtitle, category, links} = req.body;
  const mockup = req.file.path;

  projectModel.findById(id)
  .then((data) => {
    if (!data) {
      const err = new Error('Data not found');
      err.errorStatus = 404;
      throw err;
    }
    removeImage(data.mockup);

    data.title = title;
    data.subtitle = subtitle;
    data.category = category;
    data.mockup = mockup;
    data.links = links;

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

const deleteProject = (req, res, next) => {
  const id = req.params.id;

  projectModel.findById(id)
  .then((data) => {
    if (!data) {
      const error = new Error('Data not found');
      error.errorStatus = 404;
      throw error;
    }

    removeImage(data.mockup);
    return projectModel.findByIdAndRemove(id);
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

module.exports = {getAllProject, getProjectByCategory, createProject, updateProject, deleteProject};
