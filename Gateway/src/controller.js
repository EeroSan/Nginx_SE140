const axios = require('axios');

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
        const service1Response = await Promise.all([axios.get('http://service1/')]);
        
        res.status(200).send(
            `service1: ${service1Response.data}`
        );
    } catch (error) {
        console.error('Error fetching service data:', error.message);
        res.status(500).send('Failed to retrieve service information');
    }

}