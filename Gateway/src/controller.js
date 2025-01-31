const axios = require("axios");
const e = require("express");
const fs = require("fs");
const path = require("path");

const STATE_SERVICE_LOGIN_URL = "http://stateservice:8195/login";
const STATE_SERVICE_LOGOUT_URL = "http://stateservice:8195/logout";
const STATE_SERVICE_SYSTEM_URL = "http://stateservice:8195/system-state";

const allowRequests = async () => {
  try {
    const loginResponse = await axios.get(STATE_SERVICE_LOGIN_URL);
    const systemResponse = await axios.get(STATE_SERVICE_SYSTEM_URL);

    if (loginResponse.status === 200 && systemResponse.status === 200) {
      const loginState = loginResponse.data.login_state;
      const systemState = systemResponse.data.system_state;

      return (
        loginState && (systemState === "RUNNING" || systemState === "INIT")
      );
    }
    return false;
  } catch (error) {
    console.error("Error checking status:", error.message);
    return false;
  }
};

exports.getLoginStatus = async (req, res) => {
  console.log("Attempting to get state");
  try {
    const response = await axios.get(STATE_SERVICE_LOGIN_URL);
    if (response.status === 200) {
      const textcontent = response.data.login_state;
      res.status(200).send(textcontent);
    } else {
      res.status(200).send("missing loginstatus");
    }
  } catch (error) {
    res.status(500).send("ERROR");
  }
};

exports.getState = async (req, res) => {
  console.log("Attempting to get state");
  try {
    const response = await axios.get(STATE_SERVICE_SYSTEM_URL);
    if (response.status === 200) {
      const textcontent = response.data.system_state;
      res.status(200).send(textcontent);
    } else {
      res.status(200).send("missing systemstatus");
    }
  } catch (error) {
    res.status(500).send("ERROR");
  }
};

// XX
exports.putState = async (req, res) => {
  console.log("putState is hit with body: ", req.body);

  try {
    const isLoggedIn = await isUserLoggedIn();
    if (!isLoggedIn) {
      return res.status(403).send("User not logged in");
    }

    const oldState = await getOldState();
    let newState = parseNewState(req.body);
    console.log("oldState: ", oldState, "->  newState: ", newState);

    if (!newState) {
      return res.status(400).send("Invalid or empty state provided");
    }

    logStateChange(oldState, newState);

    const validStates = ["INIT", "PAUSED", "RUNNING", "SHUTDOWN"];
    if (!validStates.includes(newState)) {
      return res.status(400).send("Invalid state");
    }

    // Handle specific state transitions
    if (newState === "INIT") {
      return handleInitState(res);
    }

    if (newState === "SHUTDOWN") {
      return handleShutdownState(oldState, res);
    }

    // Default state update
    return updateState(newState, res);
  } catch (error) {
    console.error("Error processing state update:", error.message);
    return res.status(500).send("Internal server error");
  }
};

// Helper function to check if the user is logged in
const isUserLoggedIn = async () => {
  try {
    const response = await axios.get(STATE_SERVICE_LOGIN_URL);
    return response.status === 200 && response.data.login_state;
  } catch (error) {
    console.error("Error checking login state:", error.message);
    return false;
  }
};

// Helper function to fetch the old state
const getOldState = async () => {
  try {
    const stateResponse = await axios.get(STATE_SERVICE_SYSTEM_URL);
    return stateResponse.status === 200
      ? stateResponse.data.system_state
      : "INIT";
  } catch (error) {
    console.error("Error fetching old state:", error.message);
    return "INIT";
  }
};

// Helper function to parse and validate new state
const parseNewState = (newState) => {
  if (typeof newState === "string") {
    return newState.trim();
  }
  return null;
};

// Helper function to log state changes
const logStateChange = (oldState, newState) => {
  const timestamp = new Date().toISOString();
  if (oldState && newState) {
    appendToLog(`${timestamp}: ${oldState} -> ${newState}`);
  }
};

// Handle INIT state separately
const handleInitState = async (res) => {
  try {
    const changeInit = await axios.put(STATE_SERVICE_SYSTEM_URL, {
      system_state: "INIT",
    });
    if (changeInit.status === 200) {
      console.log("Changed state to INIT");
    }
    return res.status(200).send("INIT");
  } catch (error) {
    console.error("Error handling INIT state:", error.message);
    return res.status(500).send("Failed to transition to INIT");
  }
};

// Handle SHUTDOWN state separately
const handleShutdownState = async (oldState, res) => {
  if (oldState !== "RUNNING" && oldState !== "PAUSED") {
    return res
      .status(418)
      .send("System state is not RUNNING or PAUSED, cannot shutdown");
  }

  try {
    await axios.put(STATE_SERVICE_SYSTEM_URL, { system_state: "SHUTDOWN" });
    shutdownAll();
    return res.status(200).send("SHUTDOWN");
  } catch (error) {
    console.error("Error updating state to SHUTDOWN:", error.message);
    return res.status(500).send("Failed to update state to SHUTDOWN");
  }
};

// Generic function to update system state
const updateState = async (newState, res) => {
  try {
    const response = await axios.put(STATE_SERVICE_SYSTEM_URL, {
      system_state: newState,
    });
    if (response.status === 200) {
      return res.status(200).send(newState);
    }
    return res.status(500).send("Failed to update state");
  } catch (error) {
    console.error("Error updating state:", error.message);
    return res.status(500).send("Failed to update state");
  }
};
// XX -X

exports.getRequest = async (req, res) => {
  try {
    console.log("GET /request recieved");
    const allowContinue = await allowRequests();
    console.log("allowRequests: ", allowContinue);
    if (!allowContinue) {
      res.status(418).send(""); // Respond empty response to make the reciever not wait.
    } else {
      const service1Response = await axios.get(
        "http://nginx:8198/internal-service1/"
      );

      if (service1Response.status === 200) {
        const responseBody = service1Response.data; // Use `.data` to access response body
        res.status(200).send(`service1: ${JSON.stringify(responseBody)}`);
      } else if (service1Response.status === 418) {
        console.log("System state is not INIT or RUNNING");
        res.status(418).send();
      } else {
        res.status(500).send();
      }
    }
  } catch (error) {
    console.error("Error fetching service data:", error.message);
    res.status(500).send("Failed to retrieve service information");
  }
};

const logFilePath = path.join(__dirname, "run-log.txt");

const ensureLogFile = () => {
  if (!fs.existsSync(logFilePath)) {
    fs.writeFileSync(logFilePath, "");
  } else {
    try {
      fs.accessSync(logFilePath, fs.constants.R_OK | fs.constants.W_OK);
    } catch (err) {
      fs.unlinkSync(logFilePath);
      //fs.writeFileSync(logFilePath, '2023-11-01T06.35:01.380Z: INIT->RUNNING');
    }
  }
};

const appendToLog = (message) => {
  console.log("appendToLog: ", message);
  ensureLogFile();
  fs.appendFileSync(logFilePath, message);
  fs.appendFileSync(logFilePath, "\n");
};

exports.getRunLog = async (req, res) => {
  ensureLogFile();
  try {
    const logData = fs.readFileSync(logFilePath, "utf8");
    res.status(200).send(logData);
  } catch (error) {
    console.error("Error reading log file:", error.message);
    res.status(500).send("Failed to read log file");
  }
};

exports.shutdownRemaining = async (req, res) => {
  try {
    console.log("Attempting to shut down system");
    await shutdownStateService();
    await delay(2000);
    shutdown();
  } catch (error) {
    console.error("Error shutting down services:", error.message);
  }
};

const shutdownAll = async () => {
  try {
    await shutdownNginxS1();
    await delay(6000);
    await shutdownNginxS2();
    await delay(2000);

    await shutdownNginxSelf();
    await delay(2000);

    await shutdownStateService();
    await delay(2000);
    await shutdown();
  } catch (error) {
    console.error("Error shutting down services:", error.message);
  }
};

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const shutdownStateService = async () => {
  try {
    await axios.get("http://stateservice:8195/shutdown");
  } catch (error) {
    console.error("Error shutting down services:", error.message);
  }
};

const shutdownNginxSelf = async () => {
  try {
    await axios.get("http://nginx:8198/shutdownself/");
  } catch (error) {
    console.error("Error shutting down services:", error.message);
  }
};

const shutdownNginxS2 = async () => {
  try {
    await axios.get("http://nginx:8198/shutdowns2/");
  } catch (error) {
    console.error("Error shutting down services:", error.message);
  }
};

const shutdownNginxS1 = async () => {
  try {
    await axios.get("http://nginx:8198/shutdowns1/");
  } catch (error) {
    console.error("Error shutting down services:", error.message);
  }
};

const shutdown = async (req, res) => {
  try {
    console.log("Attempting to shut down system");
    process.exit(0);
  } catch (error) {
    console.error("Error shutting down services:", error.message);
  }
};
