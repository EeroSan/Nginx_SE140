const express = require('express');
const app = express();
const serverRoutes = require('./routes');
const mongoose = require('mongoose');
const cors = require('cors');
app.use(cors());
app.use(express.json());

const State = require('./models/State');

const PORT = process.env.PORT || 8195;
const BASE_URL_API = process.env.BASE_URL_API || '/';

app.use(BASE_URL_API, serverRoutes);

if(process.env.RUN_TESTS === "NO")
  {
    const mongoURL = `${process.env.MONGO_DB}://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_IP}:${process.env.MONGO_PORT}/${process.env.MONGO_COLLECTION}?authSource=admin`;
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
    connectToMongoWithRetry();

    app.listen(PORT, () => {
      const initializeStates = async () => {
        try {
          const state = await State.findOne();

          state.system_state = "INIT";
          state.login_state = false;
          await state.save();
          console.log("System state initialized to 'INIT'");
        } catch (error) {
          console.error("Error initializing system state:", error);
        }
      };

      initializeStates();
      console.log(`State service is running on http://localhost:${PORT}${BASE_URL_API}`);
  });
  } else
  {
      console.log("Skipping app.listen")
  }

  module.exports = app;