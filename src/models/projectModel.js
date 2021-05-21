const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  mockup: String,
  links: [{name: String, link: String, logo: String}],
});

module.exports = mongoose.model('Project', ProjectSchema);
