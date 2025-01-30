const axios = require('axios');
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
const State = require('./models/State');
const STATE_PUT_URL = 'http://gateway:8197/state';

// POST /login - Set login state to true
exports.postLogin = async (req, res) => {
  console.log("POST /login endpoint");
  try {
    const state = await State.findOne();

    if (!state) {
      return res.status(404).send({ message: "State not initialized." });
    }

    state.login_state = true;
    await state.save();
    if(state.system_state === 'INIT')
    {
      const stateResponse = await axios.put(STATE_PUT_URL, 'RUNNING', {
        headers: {
        'Content-Type': 'text/plain'
        }
      });
    }
    

    res.status(200).send({ message: "Login state updated.", login_state: state.login_state });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Internal server error." });
  }
};

exports.postLogout = async (req, res) => 
{
  console.log("POST /logout endpoint")
  try {
    const state = await State.findOne();

    if (!state) {
      return res.status(404).send({ message: "State not initialized." });
    }

    state.login_state = false;
    await state.save();
    res.status(200).send({ message: "Login state updated.", login_state: state.login_state });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Internal server error." });
  }
  

}

// GET /login - Get the login state
exports.getLogin = async (req, res) => {
  try {
    const state = await State.findOne();

    if (!state) {
      return res.status(404).send({ message: "State not initialized." });
    }

    res.status(200).send({ login_state: state.login_state });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Internal server error." });
  }
};

// PUT /system_state - Update the system state
exports.putSystemState = async (req, res) => {
  try {
    const { system_state } = req.body;

    // Validate system_state
    const validStates = ["INIT", "PAUSED", "RUNNING", "SHUTDOWN", "FAILURE"];
    if (!validStates.includes(system_state)) {
      return res.status(400).send({ message: "Invalid system_state." });
    }

    const state = await State.findOne();

    if (!state) {
      return res.status(404).send({ message: "State not initialized." });
    }

    state.system_state = system_state;
    await state.save();
    res.status(200).send({ message: "System state updated.", system_state: state.system_state });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Internal server error." });
  }
};

// GET /system_state - Get the system state
exports.getSystemState = async (req, res) => {
  try {
    const state = await State.findOne();

    if (!state) {
      return res.status(404).send({ message: "State not initialized." });
    }

    res.status(200).send({ system_state: state.system_state });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Internal server error." });
  }
};

const shutdownMongo = async () => {
  try {
    // MongoDB Admin credentials from your environment variables
    const mongoAdminURI = `${process.env.MONGO_DB}://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_IP}:${process.env.MONGO_PORT}/admin?authSource=admin`;

    const client = new MongoClient(mongoAdminURI);
    await client.connect();
    
    // Run shutdown command on admin database
    const adminDb = client.db().admin();
    await adminDb.command({ shutdown: 1 });

    console.log("MongoDB shutdown command issued successfully.");

    // Close the Mongoose connection
    await mongoose.connection.close();
    console.log("Mongoose connection closed.");

    res.status(200).send({ message: "MongoDB is shutting down." });

    // Exit the Node.js process after a short delay to allow the response to be sent
    setTimeout(() => process.exit(0), 500);

  } catch (error) {
    console.error("Error while shutting down MongoDB:", error);
    res.status(500).send({ message: "Error shutting down MongoDB.", error: error.message });
  }
};

exports.shutdown = async (req, res) => {
  await shutdownMongo();
  
  console.log('Attempting to shut down system');
  process.exit(0);
};