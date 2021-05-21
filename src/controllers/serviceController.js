const {validationResult} = require('express-validator');
const serviceModel = require('../models/serviceModel');
const path = require('path');
const fs = require('fs');

const getAllServices = (req, res, next) => {
  serviceModel.find()
  .sort({
    order: 1,
  })
  .then((result) => {
    res.status(200).json({
      message: 'Service items retrieved successfully',
      data: result,
    });
  })
  .catch((err) => {
    next(err);
  });
};

const createService = (req, res, next) => {
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

  const {title, caption, width, height, order} = req.body;
  const logo = req.file.path;
  const service = new serviceModel({
    title: title,
    caption: caption,
    logo: logo,
    width: width,
    height: height,
    order: order,
  });

  service.save()
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

const updateService = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const err = new Error('Invalid value');
    err.errorStatus = 400;
    err.data = errors.array();
    throw err;
  }

  const id = req.params.id;
  const {title, caption, width, height, order} = req.body;
  const logo = req.file.path;

  serviceModel.findById(id)
  .then((data) => {
    if (!data) {
      const err = new Error('Data not found');
      err.errorStatus = 404;
      throw err;
    }
    removeImage(data.logo);

    data.title = title;
    data.caption = caption;
    data.logo = logo;
    data.width = width;
    data.height = height;
    data.order = order;

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

const deleteService = (req, res, next) => {
  const id = req.params.id;

  serviceModel.findById(id)
  .then((data) => {
    if (!data) {
      const error = new Error('Data not found');
      error.errorStatus = 404;
      throw error;
    }

    removeImage(data.logo);
    return serviceModel.findByIdAndRemove(id);
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

module.exports = {getAllServices, createService, updateService, deleteService};
