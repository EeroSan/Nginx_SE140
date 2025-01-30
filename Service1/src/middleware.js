const axios = require('axios');

const STATE_SERVICE_URL = 'http://stateservice:8195/system-state'; // Update port if necessary

// Middleware to check system state
const checkSystemState = async (req, res, next) => {
    try {
        const response = await axios.get(STATE_SERVICE_URL);

        if (response.status === 200 && (response.data.system_state === 'RUNNING' || response.data.system_state === 'INIT')) {
            return next(); // Continue processing request
        } else {
            return res.status(418).json({ error: "System is not in RUNNING state." });
        }
    } catch (error) {
        console.error('Error checking system state:', error.message);
        return res.status(500).json({ error: "Failed to check system state." });
    }
};

module.exports = checkSystemState;
