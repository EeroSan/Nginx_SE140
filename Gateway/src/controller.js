// const os = require('os');
// const fs = require('fs');
// const path = require('path');
// const { exec } = require('child_process');


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