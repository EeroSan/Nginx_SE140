// const os = require('os');
// const fs = require('fs');
// const path = require('path');
// const { exec } = require('child_process');


exports.getState = (req, res) => {
    console.log('Attempting to get state');
    res.status(200).send('Current state');
};

