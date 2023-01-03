// Import the mongoose module
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const env = require('./environment');

//Set up default mongoose connection
const mongoDB = env.MongoDB_URL;
mongoose.set("strictQuery", false);
module.exports = mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log("CONNECTION ESTABLISHED"));
