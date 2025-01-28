const express = require('express');
const app = express();
const serverRoutes = require('./routes');
const mongoose = require('mongoose');
const cors = require('cors');
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8195;
const BASE_URL_API = process.env.BASE_URL_API || '/';


/**
 * Connects to MongoDB with retry mechanism.
 * If connection fails, it will retry after 5 seconds.
 */
const connectToMongoWithRetry = () => {
    mongoose.connect(mongoURL)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => {
        console.log(err);
        setTimeout(connectToMongoWithRetry, 5000);
    });
}


app.use(BASE_URL_API, serverRoutes);




if(process.env.RUN_TESTS === "NO")
  {
    const mongoURL = `${process.env.MONGO_DB}://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_IP}:${process.env.MONGO_PORT}/${process.env.MONGO_COLLECTION}?authSource=admin`;
    connectToMongoWithRetry();

    app.listen(PORT, () => {
      console.log(`State service is running on http://localhost:${PORT}${BASE_URL_API}`);
  });
  } else
  {
      console.log("Skipping app.listen")
  }

  module.exports = app;