const axios = require('axios');
const fs = require('fs');
const path = require('path');

const STATE_SERVICE_LOGIN_URL = 'http://stateservice:8195/login';
const STATE_SERVICE_LOGOUT_URL = 'http://stateservice:8195/logout';
const STATE_SERVICE_SYSTEM_URL = 'http://stateservice:8195/system-state';


const statusCheck = async () => {
    try {
        const loginResponse = await axios.get(STATE_SERVICE_LOGIN_URL);
        const systemResponse = await axios.get(STATE_SERVICE_SYSTEM_URL);

        if (loginResponse.status === 200 && systemResponse.status === 200) {
            const loginState = loginResponse.data.login_state;
            const systemState = systemResponse.data.system_state;

            if (loginState && (systemState === 'RUNNING' || systemState === 'INIT')) {
                return true;
            }
            return false;
        }
        return false;
    } catch (error) {
        console.error('Error checking status:', error.message);
        return false;
    }
};

exports.getLoginStatus = async (req, res) => {
    console.log('Attempting to get state');
    try{
        const response = await axios.get(STATE_SERVICE_LOGIN_URL);
        if(response.status === 200)
        {
            const textcontent = response.data.login_state;
            res.status(200).send(textcontent);
        } else
        {
            res.status(200).send('missing loginstatus');
        }
    } catch(error)
    {
        res.status(500).send('ERROR');
    }
    
}

exports.getState = async (req, res) => {
    console.log('Attempting to get state');
    try{
        const response = await axios.get(STATE_SERVICE_SYSTEM_URL);
        if(response.status === 200)
        {
            const textcontent = response.data.system_state;
            res.status(200).send(textcontent);
        } else
        {
            res.status(200).send('missing systemstatus');
        }
    

    } catch(error)
    {
        res.status(500).send('ERROR');
    }
    
};

exports.putState = async (req, res) => {
    console.log("putState is hit with body: ", req.body);
    const response = await axios.get(STATE_SERVICE_LOGIN_URL);
    const stateResponse = await axios.get(STATE_SERVICE_SYSTEM_URL);
    let oldState;
    if(stateResponse.status===200)
    {
        oldState = stateResponse.data.system_state;
        
    } else
    {
        oldState = 'INIT';
    }
    if(response.status === 200)
    {
        if(response.data.login_state)
        {
            console.log("oldState:", oldState)
            //console.log("response.data",response.data);
            
            const validStates = ['INIT', 'PAUSED', 'RUNNING', 'SHUTDOWN'];
            let newState = req.body;
            if (newState && typeof newState === "string") {
                console.log("newState", newState);
                newState = newState.trim();
            } else if (!newState || Object.keys(newState).length === 0) {
                console.log("Empty or invalid newState");
                newState = null; // Or set a default value if needed
            }

            const timestamp = new Date().toISOString();
            if(oldState && newState)
            {
                appendToLog(`${timestamp}: ${oldState} -> ${newState}`);

            }
            

            if (validStates.includes(newState)) {
                if(newState === 'INIT')
                {
                    const logoutresponse = axios.get(STATE_SERVICE_LOGOUT_URL);
                    if(logoutresponse.status === 200)
                    {
                        console.log("logged out");
                    }
                    res.status(200).send(`${newState}`);
                }
                axios.put(STATE_SERVICE_SYSTEM_URL, { system_state: newState })
                    .then(response => {
                        if (response.status === 200) {
                            res.status(200).send(`${newState}`);
                        } else {
                            res.status(500).send('Failed to update state');
                        }
                    })
                    .catch(error => {
                        console.error('Error updating state:', error.message);
                        res.status(500).send('Failed to update state');
                    });
            } else {
                res.status(400).send();
            }

        }
    }
    
};

exports.getRequest = async (req, res) => {
    try {
        //const service1Response = await Promise.all([axios.get('service1/:8199')]);
        //const service1Response = await fetch('http://service1:8199/');
        console.log("GET /request recieved");
        // const service1Response = await fetch('http://nginx:8198/internal-service1/');
        const service1Response = await axios.get('http://nginx:8198/internal-service1/');
        console.log("service1Response: ", service1Response);
        if(service1Response.status === 200)
        {
            const responseBody = await service1Response.text();
        res.status(200).send(
            `service1: ${responseBody}`
        );

        }else if(service1Response.status === 418) 
        {
            console.log("System state is not INIT or RUNNING");
            res.status(418);

        }
        
        else
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
            //fs.writeFileSync(logFilePath, '2023-11-01T06.35:01.380Z: INIT->RUNNING');
        }
    }
};

const appendToLog = (message) => {
    console.log("appendToLog: ",message);
    ensureLogFile();
    fs.appendFileSync(logFilePath, message);
    fs.appendFileSync(logFilePath, '\n');
};

exports.getRunLog = async (req, res) => {
    const allowedToRespond = await statusCheck();
    if(allowedToRespond)
    {
        ensureLogFile();
        try {
            const logData = fs.readFileSync(logFilePath, 'utf8');
            res.status(200).send(logData);
        } catch (error) {
            console.error('Error reading log file:', error.message);
            res.status(500).send('Failed to read log file');
        }

    }
    
};
