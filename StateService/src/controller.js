const State = require('./models/State');

// POST /login - Set login state to true
exports.postLogin = async (req, res) => {
  try {
    const state = await State.findOne();

    if (!state) {
      return res.status(404).send({ message: "State not initialized." });
    }

    state.login_state = true;
    await state.save();
    res.status(200).send({ message: "Login state updated.", login_state: state.login_state });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Internal server error." });
  }
};

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
