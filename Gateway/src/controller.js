const axios = require('axios');
const fs = require('fs');
const path = require('path');

exports.getState = (req, res) => {
    console.log('Attempting to get state');
    res.status(200).send('Current state');
};

exports.putState = (req, res) => {
    //console.log("req", req);
    console.log("req.body: ", req.body)
    const validStates = ['INIT', 'PAUSED', 'RUNNING', 'SHUTDOWN'];
    let newState = req.body;
    if(newState) newState= newState.trim();
    appendToLog(`State changed to: ${newState}`);

    if (validStates.includes(newState)) {
        console.log(`State changed to: ${newState}`);
        // res.status.send(new json({"state":newState}))
        res.status(200).send(`${newState}`);
    } else {
        res.status(400).send();
    }
};

exports.getRequest = async (req, res) => {
    try {
        //const service1Response = await Promise.all([axios.get('service1/:8199')]);
        const service1Response = await fetch('http://service1:8199/');
        if(service1Response.ok)
        {
            const responseBody = await service1Response.text();
        res.status(200).send(
            `service1: ${responseBody}`
        );

        } else
        {
            res.status(500).send();
        }

        
    } catch (error) {
        console.error('Error fetching service data:', error.message);
        res.status(500).send('Failed to retrieve service information');
    }

}



const logFilePath = path.join(__dirname, 'run-log.txt');

const ensureLogFile = () => {
    if (!fs.existsSync(logFilePath)) {
        fs.writeFileSync(logFilePath, '');
    } else {
        try {
            fs.accessSync(logFilePath, fs.constants.R_OK | fs.constants.W_OK);
        } catch (err) {
            fs.unlinkSync(logFilePath);
            fs.writeFileSync(logFilePath, '2023-11-01T06.35:01.380Z: INIT->RUNNING');
        }
    }
};

const appendToLog = (message) => {
    ensureLogFile();
    fs.appendFileSync(logFilePath, `${new Date().toISOString()} - ${message}\n`);
};

exports.getRunLog = async (req, res) => {
    ensureLogFile();
    try {
        const logData = fs.readFileSync(logFilePath, 'utf8');
        res.status(200).send(logData);
    } catch (error) {
        console.error('Error reading log file:', error.message);
        res.status(500).send('Failed to read log file');
    }
};
