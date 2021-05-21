const {validationResult} = require('express-validator');
const socialModel = require('../models/socialModel');
const path = require('path');
const fs = require('fs');

const getAllSocials = (req, res, next) => {
  socialModel.find()
  .then((result) => {
    res.status(200).json({
      message: 'Socials retrieved successfully',
      data: result,
    });
  })
  .catch((err) => {
    next(err);
  });
};

const getSocialById = (req, res, next) => {
  const id = req.params.id;

  socialModel.findById(id)
  .then((result) => {
    if (!result) {
      const error = new Error('Social not found');
      error.errorStatus = 404;
      throw error;
    }
    res.status(200).json({
      message: 'Social retrieved successfully',
      data: result,
    });
  })
  .catch((err) => {
    next(err);
  });
};

const createSocial = (req, res, next) => {
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

  const {name, link} = req.body;
  const logo = req.file.path;
  const social = new socialModel({
    name: name,
    link: link,
    logo: logo,
  });

  social.save()
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

const updateSocial = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const err = new Error('Invalid value');
    err.errorStatus = 400;
    err.data = errors.array();
    throw err;
  }

  const id = req.params.id;
  const {name, link} = req.body;
  const logo = req.file.path;

  socialModel.findById(id)
  .then((data) => {
    if (!data) {
      const err = new Error('Social not found');
      err.errorStatus = 404;
      throw err;
    }
    removeImage(data.logo);

    data.name = name;
    data.link = link;
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

const deleteSocial = (req, res, next) => {
  const id = req.params.id;

  socialModel.findById(id)
  .then((data) => {
    if (!data) {
      const error = new Error('Social not found');
      error.errorStatus = 404;
      throw error;
    }

    removeImage(data.logo);
    return socialModel.findByIdAndRemove(id);
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

module.exports = {getAllSocials, getSocialById, createSocial, updateSocial, deleteSocial};
