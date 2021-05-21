const mongoose = require('mongoose');

const mongodb = 'mongodb://localhost/putrachajar';

mongoose.connect(mongodb)
.then(() => console.log('MongoDB Connected'))
.catch((err) => console.log(err));

mongoose.Promise = global.Promise;

module.exports = mongoose;
