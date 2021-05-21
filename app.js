const mongoose = require('mongoose');
const aboutModel = require('./aboutModel');

const server = '127.0.0.1:27017';
const database = 'test';

const connectDB = async () => {
  try {
    await mongoose.connect(`mongodb://${server}/${database}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });

    console.log('MongoDB connected!!');

    const about = new aboutModel({
      title: 'title',
      caption: 'caption',
    });

    await about.save()
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });

    await aboutModel.find()
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });
  } catch (err) {
    console.log('Failed to connect to MongoDB', err);
  }
};

connectDB();
