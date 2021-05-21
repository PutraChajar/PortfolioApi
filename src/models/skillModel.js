const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Skill', SkillSchema);
